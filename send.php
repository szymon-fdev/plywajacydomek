<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Niedozwolona metoda żądania."]);
    exit;
}

$to = "szymis09@gmail.com"; 

$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
$from_system = "no-reply@" . $host;

$name    = strip_tags(trim($_POST["name"] ?? ''));
$email   = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = strip_tags(trim($_POST["subject"] ?? ''));
$message = trim($_POST["message"] ?? '');

if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Wypełnij poprawnie wszystkie wymagane pola."]);
    exit;
}

$email_subject = "Formularz (" . $subject . ") od: " . $name;

$email_body  = "Nowa wiadomość ze strony internetowej:\n";
$email_body .= "----------------------------------------\n";
$email_body .= "Od:       " . $name . "\n";
$email_body .= "E-mail:   " . $email . "\n";
$email_body .= "Temat:    " . $subject . "\n";
$email_body .= "----------------------------------------\n\n";
$email_body .= "Treść:\n" . $message . "\n";

$headers   = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/plain; charset=utf-8";
$headers[] = "From: Powiadomienia WWW (Pływające Domki)<" . $from_system . ">";
$headers[] = "Reply-To: " . $name . " <" . $email . ">";

if (@mail($to, $email_subject, $email_body, implode("\r\n", $headers))) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Błąd serwera. Spróbuj ponownie później."]);
}
?>