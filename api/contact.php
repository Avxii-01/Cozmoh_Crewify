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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Consultation Request</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #07060B;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        width: 100% !important;
        padding: 12px !important;
      }
      .email-card {
        padding: 24px 18px !important;
        border-radius: 12px !important;
      }
      .data-row-label {
        display: block !important;
        width: 100% !important;
        padding-bottom: 4px !important;
      }
      .data-row-value {
        display: block !important;
        width: 100% !important;
        padding-bottom: 14px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #07060B; color: #ECECF1;">
  <!-- Outer Background Container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #07060B; width: 100%; margin: 0; padding: 32px 0;">
    <tr>
      <td align="center" style="padding: 0 12px;">
        
        <!-- Main Email Card (Max width 620px) -->
        <table role="presentation" class="email-wrapper" width="620" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; width: 100%; margin: 0 auto; background-color: #120E20; border: 1px solid #2B2244; border-radius: 16px; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #231B38;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: #FFFFFF;">
                      CREW<span style="color: #A78BFA;">ii</span>FY
                    </div>
                    <div style="font-size: 12px; font-weight: 500; letter-spacing: 0.04em; color: #9CA3AF; margin-top: 4px;">
                      Consultation &amp; Project Request
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; background-color: rgba(139, 92, 246, 0.14); border: 1px solid rgba(167, 139, 250, 0.32); border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #C4B5FD;">
                      NEW LEAD
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td class="email-card" style="padding: 32px 32px 28px 32px;">
              
              <!-- Section Intro -->
              <div style="margin-bottom: 24px;">
                <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em; line-height: 1.25;">
                  New Consultation Request
                </h1>
                <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                  A new consultation request has been submitted through the CREWiiFY website.
                </p>
              </div>

              <!-- Information Card Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #17122A; border: 1px solid #2D234A; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                <!-- Full Name -->
                <tr>
                  <td class="data-row-label" width="34%" style="padding: 13px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #A78BFA; border-bottom: 1px solid #231B38;">
                    Full Name
                  </td>
                  <td class="data-row-value" style="padding: 13px 18px; font-size: 14px; font-weight: 600; color: #FFFFFF; border-bottom: 1px solid #231B38;">
                    {$cleanName}
                  </td>
                </tr>
                <!-- Agency / Company -->
                <tr>
                  <td class="data-row-label" width="34%" style="padding: 13px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #A78BFA; border-bottom: 1px solid #231B38;">
                    Agency / Company
                  </td>
                  <td class="data-row-value" style="padding: 13px 18px; font-size: 14px; color: #F3F4F6; border-bottom: 1px solid #231B38;">
                    {$cleanAgency}
                  </td>
                </tr>
                <!-- Work Email -->
                <tr>
                  <td class="data-row-label" width="34%" style="padding: 13px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #A78BFA; border-bottom: 1px solid #231B38;">
                    Work Email
                  </td>
                  <td class="data-row-value" style="padding: 13px 18px; font-size: 14px; color: #FFFFFF; border-bottom: 1px solid #231B38;">
                    <a href="mailto:{$cleanEmail}" style="color: #C4B5FD; text-decoration: none; font-weight: 600;">{$cleanEmail}</a>
                  </td>
                </tr>
                <!-- Phone / WhatsApp -->
                <tr>
                  <td class="data-row-label" width="34%" style="padding: 13px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #A78BFA; border-bottom: 1px solid #231B38;">
                    Phone / WhatsApp
                  </td>
                  <td class="data-row-value" style="padding: 13px 18px; font-size: 14px; color: #F3F4F6; border-bottom: 1px solid #231B38;">
                    {$cleanPhone}
                  </td>
                </tr>
                <!-- Project Type -->
                <tr>
                  <td class="data-row-label" width="34%" style="padding: 13px 18px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #A78BFA;">
                    Project Type
                  </td>
                  <td class="data-row-value" style="padding: 13px 18px;">
                    <span style="display: inline-block; background-color: rgba(139, 92, 246, 0.22); border: 1px solid rgba(167, 139, 250, 0.45); border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; color: #E9D5FF;">
                      {$cleanProjectType}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 26px;">
                <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #A78BFA; margin-bottom: 8px;">
                  Project Details &amp; Message
                </div>
                <div style="background-color: #17122A; border: 1px solid #2D234A; border-left: 3px solid #8B5CF6; border-radius: 10px; padding: 18px 20px; font-size: 14px; line-height: 1.65; color: #E5E7EB; word-break: break-word;">
                  {$cleanMessage}
                </div>
              </div>

              <!-- Primary Action CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                <tr>
                  <td align="left">
                    <a href="mailto:{$cleanEmail}?subject=Re:%20CREWiiFY%20Consultation%20Request" style="display: inline-block; background-color: #8B5CF6; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.02em; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);">
                      Reply to Enquiry &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Subtle Footer -->
          <tr>
            <td style="padding: 18px 32px 24px 32px; border-top: 1px solid #231B38; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #9CA3AF;">
                CREW<span style="color: #A78BFA;">ii</span>FY &bull; Website Consultation Request
              </p>
              <p style="margin: 0; font-size: 11px; color: #6B7280; line-height: 1.4;">
                This message was generated automatically by the CREWiiFY website contact form on {$timestamp}.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
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
