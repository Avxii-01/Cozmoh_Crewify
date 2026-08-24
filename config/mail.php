<?php
/**
 * CREWiiFY Server-Side Mail & SMTP Configuration
 * 
 * Supports environment variables, local overrides via config/mail.local.php,
 * and secure default settings for development / production.
 */

// Load optional local secret config if present
$localConfigFile = __DIR__ . '/mail.local.php';
$localConfig = [];
if (file_exists($localConfigFile)) {
    $localConfig = require $localConfigFile;
    if (!is_array($localConfig)) {
        $localConfig = [];
    }
}

return [
    // SMTP Server Settings
    'smtp_host'       => getenv('SMTP_HOST') ?: ($localConfig['smtp_host'] ?? 'smtp.gmail.com'),
    'smtp_port'       => (int)(getenv('SMTP_PORT') ?: ($localConfig['smtp_port'] ?? 587)),
    'smtp_encryption' => getenv('SMTP_ENCRYPTION') ?: ($localConfig['smtp_encryption'] ?? 'tls'), // 'tls' (587) or 'ssl' (465)
    
    // SMTP Authentication Credentials
    'smtp_username'   => getenv('SMTP_USERNAME') ?: ($localConfig['smtp_username'] ?? ''),
    'smtp_password'   => getenv('SMTP_PASSWORD') ?: ($localConfig['smtp_password'] ?? ''), // Google App Password or SMTP Secret
    
    // Email Header Routing
    'mail_from'       => getenv('MAIL_FROM') ?: ($localConfig['mail_from'] ?? ''),
    'mail_from_name'  => getenv('MAIL_FROM_NAME') ?: ($localConfig['mail_from_name'] ?? 'CREWiiFY Website Contact'),
    'mail_to'         => getenv('MAIL_TO') ?: ($localConfig['mail_to'] ?? ''),
    'mail_to_name'    => getenv('MAIL_TO_NAME') ?: ($localConfig['mail_to_name'] ?? 'CREWiiFY Team'),

    // Debug Mode (Set to true only for temporary troubleshooting, false in normal operation)
    'debug'           => (bool)(getenv('MAIL_DEBUG') ?: ($localConfig['debug'] ?? false))
];
