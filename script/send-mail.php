<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = $_POST['recipient']; 

    $headers = 'From: noreply@developerakademie.com' . "\r\n" .
        'Reply-To: noreply@jjoin.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    $subject = 'Reset Password';
    $message = 'Click on the following Link to reset your password: https://gruppe-670.developerakademie.net/reset-password.html';

    // E-Mail senden
    if (mail($to, $subject, $message, $headers)) {
        echo 'E-Mail wurde erfolgreich versendet';
    } else {
        echo 'Es gab ein Problem beim Versenden der E-Mail. Bitte versuchen Sie es später erneut.';
    }
} else {
    header("Allow: POST", true, 405);
    exit;
}
