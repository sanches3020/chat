<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/event_utils.php';

$user_id = get_long_required("token");
$dialog_id = get_long_required("dialog_id");
$message_text = get_string_required("message_text");

$words = explode(" ", $message_text);

$message_result = $message_text;
$message_likes = 0;
foreach ($words as $word) {
    $fix = row("words", ["word" => $word]);
    if ($fix != null) {
        $count = substr_count($message_result, $word);
        $message_likes += $count;
        $message_result = str_replace($word, $fix["fix"], $message_result);
        trackAccumulate($word, $count);
        $stat = row("stats", ["user_id" => $user_id, "word" => $word]);
        if ($stat != null) {
            update("stats", ["amount" => $stat["amount"] + $count], ["user_id" => $user_id, "word" => $word]);
        } else {
            insert("stats", ["user_id" => $user_id, "word" => $word, "amount" => $count]);
        }
    }
}

$user = row("users", ["user_id" => $user_id]);
$new_balance = $user["user_balance"] + $message_likes;

if ($message_likes > 0) {
    update("users", [
        "user_balance" => $new_balance,
    ], ["user_id" => $user_id]);
    trackBalance($user_id, $new_balance);
}

$message_id = insert("messages", [
    "user_id" => $user_id,
    "dialog_id" => $dialog_id,
    "message_text" => $message_text,
    "message_result" => $message_result,
    "message_likes" => $message_likes,
]);

query("update dialogs set dialog_timestamp = now() where dialog_id = " . (int)$dialog_id);

success();
