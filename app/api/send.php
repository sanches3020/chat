<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/request.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/auth.php';
log_enable();

$message_text = get_required("message_text");
$message_dialog_id = get_required("message_dialog_id");
$message_sender_user_id = get_required("message_sender_user_id");
$message_reciever_user_id = get_required("message_reciever_user_id");

insert("messages", [
    "message_dialog_id" => $message_dialog_id,
    "message_sender_user_id" => $message_sender_user_id,
    "message_reciever_user_id" => $message_reciever_user_id,
    "message_text" => $message_text,
]);

$receiver = row("users", ["user_id" => $message_reciever_user_id]);
$chat_id = $receiver["user_telegram_chat_id"];
$tg_token = getenv("TG_TOKEN");

if ($chat_id && $tg_token) {
    post_json("https://api.telegram.org/bot$tg_token/sendMessage", [
        'chat_id' => $chat_id,
        'text' => $message_text,
    ]);
}

$dialog = select("messages", ["message_dialog_id" => $message_dialog_id]);
success($dialog);
