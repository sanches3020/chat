<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("user_id");
$message_text = get_string_required("message_text");
$dialog_id = get_long_required("dialog_id");

$words = explode(" ", $message_text);

$message_result = $message_text;
$message_likes = 0;
foreach ($words as $text_word) {
    $word = row("words", ["word" => $text_word]);
    if ($word != null) {
        $count = substr_count($message_result, $text_word);
        $message_likes += $count;
        $message_result = str_replace($text_word, $word["fix"], $message_result);
    }
}

if ($message_likes > 0)
    update("users", [
        "user_balance" => $message_likes,
    ], ["user_id" => $user_id]);

$message_id = insert("messages", [
    "user_id" => $user_id,
    "dialog_id" => $dialog_id,
    "message_text" => $message_text,
    "message_result" => $message_result,
    "message_likes" => $message_likes,
]);

success();
