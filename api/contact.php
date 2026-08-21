<?php
/**
 * api/contact.php - CREWiiFY Contact Form Submission Endpoint
 * 
 * Handles form validation, spam protection (honeypot & rate-limiting),
 * and dispatches consultation requests via PHPMailer + SMTP.
 */

// Strict error reporting for server log, but no display in response output
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Security and Response Headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

// Ensure POST request only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Please submit using POST.'
    ]);
    exit;
}

// Rate Limiting (File-based token bucket per IP: max 6 submissions per 10 minutes)
function checkRateLimit($ip) {
    $tempDir = sys_get_temp_dir() . '/crewiify_rate_limits';
    if (!is_dir($tempDir)) {
        @mkdir($tempDir, 0755, true);
    }
    
    $ipHash = md5($ip . '_crewiify_contact');
    $rateFile = $tempDir . '/' . $ipHash . '.json';
    $now = time();
    $window = 600; // 10 minutes
    $maxAttempts = 6;

    $history = [];
    if (file_exists($rateFile)) {
        $data = @file_get_contents($rateFile);
        $history = json_decode($data, true) ?: [];
    }

    // Filter to timestamps within the last 10 minutes
    $history = array_filter($history, function($timestamp) use ($now, $window) {
        return ($now - $timestamp) < $window;
    });

    if (count($history) >= $maxAttempts) {
        return false;
    }

    $history[] = $now;
    @file_put_contents($rateFile, json_encode(array_values($history)));
    return true;
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
if (!checkRateLimit($clientIp)) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Too many requests. Please wait a few minutes before submitting again.'
    ]);
    exit;
}

// Parse incoming input (supports both JSON and form-data)
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);

if (!is_array($inputData) || empty($inputData)) {
    $inputData = $_POST;
}

// 1. Spam Protection: Honeypot field check
$honeypot = trim($inputData['website_hp'] ?? ($inputData['honeypot'] ?? ''));
if (!empty($honeypot)) {
    // Silently acknowledge spam bot without sending email
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Your enquiry has been sent successfully.'
    ]);
    exit;
}

// 2. Extract and Sanitize User Fields
$fullName    = trim($inputData['fullName'] ?? '');
$agencyName  = trim($inputData['agencyName'] ?? '');
$email       = trim($inputData['email'] ?? '');
$phone       = trim($inputData['phone'] ?? '');
$projectType = trim($inputData['projectType'] ?? '');
$message     = trim($inputData['message'] ?? '');

// 3. Server-Side Validation
$errors = [];

if (empty($fullName) || mb_strlen($fullName, 'UTF-8') < 2 || mb_strlen($fullName, 'UTF-8') > 120) {
    $errors['fullName'] = 'Please enter your full name (2–120 characters).';
}

if (empty($agencyName) || mb_strlen($agencyName, 'UTF-8') < 2 || mb_strlen($agencyName, 'UTF-8') > 150) {
    $errors['agencyName'] = 'Please enter your agency or company name.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email, 'UTF-8') > 150) {
    $errors['email'] = 'Please enter a valid work email address.';
}

if (!empty($phone) && mb_strlen($phone, 'UTF-8') > 50) {
    $errors['phone'] = 'Phone number is too long.';
}

if (empty($projectType) || mb_strlen($projectType, 'UTF-8') > 80) {
    $errors['projectType'] = 'Please select a project type.';
}

if (empty($message) || mb_strlen($message, 'UTF-8') < 10 || mb_strlen($message, 'UTF-8') > 6000) {
    $errors['message'] = 'Please describe your project (minimum 10 characters).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please check the form for errors and try again.',
        'errors'  => $errors
    ]);
    exit;
}

// 4. Load PHPMailer and Configuration
$autoloader = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloader)) {
    error_log('CREWiiFY Contact Error: Autoloader not found at ' . $autoloader);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send your enquiry at this time. Please contact us on WhatsApp.'
    ]);
    exit;
}
require_once $autoloader;

$configFile = __DIR__ . '/../config/mail.php';
$mailConfig = file_exists($configFile) ? require $configFile : [];

$smtpHost       = $mailConfig['smtp_host'] ?? 'smtp.gmail.com';
$smtpPort       = (int)($mailConfig['smtp_port'] ?? 587);
$smtpEncryption = $mailConfig['smtp_encryption'] ?? 'tls';
$smtpUsername   = $mailConfig['smtp_username'] ?? '';
$smtpPassword   = $mailConfig['smtp_password'] ?? '';
$mailFrom       = $mailConfig['mail_from'] ?? $smtpUsername;
$mailFromName   = $mailConfig['mail_from_name'] ?? 'CREWiiFY Website Contact';
$mailTo         = $mailConfig['mail_to'] ?? $mailFrom;
$mailToName     = $mailConfig['mail_to_name'] ?? 'CREWiiFY Team';

if (empty($smtpPassword)) {
    error_log('CREWiiFY Contact Error: SMTP password is not configured in config/mail.php or config/mail.local.php.');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server email service is not configured. Please contact us on WhatsApp.'
    ]);
    exit;
}

// 5. Build Sanitized HTML and Plain Text Bodies
$cleanName        = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
$cleanAgency      = htmlspecialchars($agencyName, ENT_QUOTES, 'UTF-8');
$cleanEmail       = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$cleanPhone       = !empty($phone) ? htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') : 'Not provided';
$cleanProjectType = htmlspecialchars($projectType, ENT_QUOTES, 'UTF-8');
$cleanMessage     = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
$timestamp        = date('Y-m-d H:i:s T');

$emailSubject = "New Consultation Request — {$projectType}";

$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Consultation Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0c0a14;
      color: #f3f3f3;
      margin: 0;
      padding: 30px 15px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #141022;
      border: 1px solid rgba(167, 139, 250, 0.25);
      border-radius: 12px;
      padding: 36px 30px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);
    }
    .brand-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 18px;
      margin-bottom: 24px;
    }
    .brand-logo {
      font-size: 22px;
      font-weight: 800;
      color: #A78BFA;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .brand-tagline {
      font-size: 14px;
      color: #9A9A9A;
      margin-top: 4px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 20px 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .data-table th, .data-table td {
      padding: 11px 14px;
      text-align: left;
      font-size: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .data-table th {
      width: 32%;
      color: #C4B5FD;
      font-weight: 600;
      background: rgba(167, 139, 250, 0.06);
    }
    .data-table td {
      color: #F5F5F5;
      background: rgba(255, 255, 255, 0.02);
    }
    .message-block {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 16px;
      color: #ECECF1;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
      white-space: normal;
    }
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
      font-size: 12px;
      color: #7A7A7A;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="brand-header">
      <div class="brand-logo">CREWiiFY</div>
      <div class="brand-tagline">Consultation &amp; Project Request</div>
    </div>
    
    <h2 class="section-title">New Consultation Request</h2>
    
    <table class="data-table">
      <tr>
        <th>Full Name</th>
        <td>{$cleanName}</td>
      </tr>
      <tr>
        <th>Agency / Company</th>
        <td>{$cleanAgency}</td>
      </tr>
      <tr>
        <th>Work Email</th>
        <td><a href="mailto:{$cleanEmail}" style="color:#A78BFA; text-decoration:none;">{$cleanEmail}</a></td>
      </tr>
      <tr>
        <th>Phone / WhatsApp</th>
        <td>{$cleanPhone}</td>
      </tr>
      <tr>
        <th>Project Type</th>
        <td><strong style="color:#C4B5FD;">{$cleanProjectType}</strong></td>
      </tr>
    </table>

    <div style="font-size: 13px; font-weight: 600; color: #C4B5FD; text-transform: uppercase; margin-bottom: 8px;">
      Project Details &amp; Message
    </div>
    <div class="message-block">
      {$cleanMessage}
    </div>

    <div class="footer">
      Sent on {$timestamp} via CREWiiFY Website Contact Form
    </div>
  </div>
</body>
</html>
HTML;

$textBody = <<<TEXT
NEW CONSULTATION REQUEST

Name: {$fullName}
Agency / Company: {$agencyName}
Work Email: {$email}
Phone / WhatsApp: {$cleanPhone}
Project Type: {$projectType}

Message:
{$message}

---
Submitted on {$timestamp} via CREWiiFY Contact Page
TEXT;

// 6. Send Email via PHPMailer
try {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUsername;
    $mail->Password   = $smtpPassword;
    $mail->SMTPSecure = ($smtpEncryption === 'ssl') ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';

    // Recipients & Headers
    $mail->setFrom($mailFrom, $mailFromName);
    $mail->addAddress($mailTo, $mailToName);
    $mail->addReplyTo($email, $fullName);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $emailSubject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = $textBody;

    $mail->send();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Thanks — we've received your enquiry. We'll get back to you shortly."
    ]);
} catch (\Exception $e) {
    error_log('CREWiiFY Mailer Exception: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Something went wrong while sending your enquiry. Please try again or contact us on WhatsApp.'
    ]);
}
