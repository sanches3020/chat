<?php
require_once __DIR__ . '/auth.php';

$word = get_string_required("word");
$fix = get_string_required("fix");
$user_id = get_long_required("user_id");

$user = row("users", ["user_id" => $user_id]);

if ($user["user_balance"] < 50)
    error("Недостаточно баланса");

update("users", ["user_balance" => $user["user_balance"] - 50], ["user_id" => $user_id]);

insertOrUpdate("words", "word", $word, [
    "word" => $word,
    "fix" => $fix,
]);

insert("fixes", [
    "user_id" => $user_id,
    "word" => $word,
    "fix" => $fix,
]);

success();
