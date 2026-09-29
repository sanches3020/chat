<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/event_utils.php';

$user_id = get_long_required("token");
$dialog_id = get_long_required("dialog_id");
$message_text = get_string_required("message_text");

$words = explode(" ", $message_text);

$message_result = $message_text;
$message_likes = 0;
foreach ($words as $text_word) {
    $word = row("words", ["word" => $text_word]);
    if ($word != null) {
        $count = substr_count($message_result, $text_word);
        $message_likes += $count;
        $message_result = str_replace($text_word, $word["fix"], $message_result);
        trackAccumulate($text_word, $count);
    }
}

if ($message_likes > 0) {
    $user = row("users", ["user_id" => $user_id]);
    update("users", [
        "user_balance" => $user["user_balance"] + $message_likes,
    ], ["user_id" => $user_id]);
}

$message_id = insert("messages", [
    "user_id" => $user_id,
    "dialog_id" => $dialog_id,
    "message_text" => $message_text,
    "message_result" => $message_result,
    "message_likes" => $message_likes,
]);

success();
