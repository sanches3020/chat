<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

$user_telegram_chat_id = get_required("user_telegram_chat_id");

$user = row("users", ["user_telegram_chat_id" => $user_telegram_chat_id]);

if (!$user) {
    error("Пользователь с таким Chat ID не найден");
}

return_json([
    "success" => true,
    "user_id" => $user["user_id"],
    "user_telegram_chat_id" => $user["user_telegram_chat_id"]
]);
