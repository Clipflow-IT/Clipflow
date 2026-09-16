<?php
// Handles every contact / consultation form on the site.
// Responds with the plain text "Success" on success (js/main.js checks for it), anything else is treated as an error.

$address = "sales@clipflow.co.zw";
// Must be a mailbox on the site's own domain, otherwise many hosts / spam filters reject the message.
$from = "website@clipflow.co.zw";

header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	exit('Method not allowed');
}

// Honeypot: real visitors never fill this hidden field in.
if (!empty($_POST['hp_check'])) {
	exit('Success');
}

function field($key, $max = 200) {
	$value = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
	return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}

// Strip CR/LF so values can never inject extra mail headers.
function single_line($value) {
	return trim(preg_replace('/[\r\n]+/', ' ', $value));
}

$name    = single_line(field('name'));
$mail    = single_line(field('mail'));
$phone   = single_line(field('phone', 50));
$subject = single_line(field('subject', 100));
$message = field('message', 5000);
$page    = single_line(field('page', 200));

if ($name === '' || $message === '' || !filter_var($mail, FILTER_VALIDATE_EMAIL)) {
	http_response_code(422);
	exit('Please provide your name, a valid email address and a message.');
}

$e_subject = 'Website enquiry' . ($subject !== '' ? ': ' . $subject : '') . ' from ' . $name;

$body  = "You have received a new enquiry from the Clipflow website." . "\r\n\r\n";
$body .= "Name: $name\r\n";
$body .= "Email: $mail\r\n";
if ($phone !== '')   $body .= "Phone: $phone\r\n";
if ($subject !== '') $body .= "Subject: $subject\r\n";
if ($page !== '')    $body .= "Sent from: $page\r\n";
$body .= "\r\nMessage:\r\n" . wordwrap($message, 70, "\r\n") . "\r\n";

$headers  = "From: Clipflow Website <$from>\r\n";
$headers .= "Reply-To: $name <$mail>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

$encoded_subject = '=?UTF-8?B?' . base64_encode($e_subject) . '?=';

if (mail($address, $encoded_subject, $body, $headers)) {
	echo 'Success';
} else {
	http_response_code(500);
	echo 'ERROR';
}
