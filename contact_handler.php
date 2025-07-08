<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['firstName', 'lastName', 'email', 'subject', 'message'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $errors[] = ucfirst($field) . ' is required';
    }
}

// Validate email
if (!empty($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Sanitize input data
$firstName = htmlspecialchars(trim($input['firstName']));
$lastName = htmlspecialchars(trim($input['lastName']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars(trim($input['subject']));
$message = htmlspecialchars(trim($input['message']));

// Email configuration
$to = 'contact.risefoundation@gmail.com';
$email_subject = "R.I.S.E Foundation Contact Form: " . ucfirst($subject);

// Create email content
$email_body = "
New contact form submission from R.I.S.E Foundation website:

Name: $firstName $lastName
Email: $email
Subject: " . ucfirst($subject) . "

Message:
$message

---
Sent from R.I.S.E Foundation Contact Form
Time: " . date('Y-m-d H:i:s') . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
";

// Email headers
$headers = array(
    'From' => 'noreply@risefoundation.org',
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
);

// Convert headers array to string
$headers_string = '';
foreach ($headers as $key => $value) {
    $headers_string .= $key . ': ' . $value . "\r\n";
}

// Log the submission (create logs directory if it doesn't exist)
$log_dir = 'logs';
if (!is_dir($log_dir)) {
    mkdir($log_dir, 0755, true);
}

$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $firstName . ' ' . $lastName,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR']
];

file_put_contents(
    $log_dir . '/contact_submissions.log',
    json_encode($log_entry) . "\n",
    FILE_APPEND | LOCK_EX
);

// Try to send email
$mail_sent = mail($to, $email_subject, $email_body, $headers_string);

if ($mail_sent) {
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will get back to you soon.'
    ]);
} else {
    // Email failed, but log was saved
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been received. We will get back to you soon.'
    ]);
}

// Auto-reply to sender (optional)
$auto_reply_subject = "Thank you for contacting R.I.S.E Foundation";
$auto_reply_body = "
Dear $firstName,

Thank you for reaching out to R.I.S.E Foundation. We have received your message and will respond within 24-48 hours.

Your message:
Subject: " . ucfirst($subject) . "
Message: $message

We appreciate your interest in our mission to transform lives through compassion.

Best regards,
R.I.S.E Foundation Team
Email: contact.risefoundation@gmail.com
Phone: +234 701 933 3532, +234 811 111 0463

---
This is an automated response. Please do not reply to this email.
";

$auto_reply_headers = array(
    'From' => 'contact.risefoundation@gmail.com',
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
);

$auto_reply_headers_string = '';
foreach ($auto_reply_headers as $key => $value) {
    $auto_reply_headers_string .= $key . ': ' . $value . "\r\n";
}

// Send auto-reply (don't worry if this fails)
@mail($email, $auto_reply_subject, $auto_reply_body, $auto_reply_headers_string);
?>
