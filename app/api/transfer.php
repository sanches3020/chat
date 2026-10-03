<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/event_utils.php';

$user_id = get_long_required("token");
$recipient_id = get_long_required("recipient_id");
$amount = get_long_required("amount");

if ($user_id == $recipient_id)
    error("Нельзя отправить самому себе");

if ($amount <= 0)
    error("Сумма должна быть больше нуля");

$sender = row("users", ["user_id" => $user_id]);
if ($sender["user_balance"] < $amount)
    error("Недостаточно баланса");

$recipient = row("users", ["user_id" => $recipient_id]);
if (!$recipient)
    error("Получатель не найден");

update("users", ["user_balance" => $sender["user_balance"] - $amount], ["user_id" => $user_id]);
update("users", ["user_balance" => $recipient["user_balance"] + $amount], ["user_id" => $recipient_id]);

trackBalance($user_id, -$amount);
trackBalance($recipient_id, $amount);

success();
