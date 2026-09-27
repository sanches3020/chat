<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");

$subs = select("subs", [
    "user_id" => $user_id
]);

$response = [];

foreach ($subs as $sub) {
    $dialog =  row("dialogs", ["dialog_id" => $sub["dialog_id"]]);
    $message = rowSql("select * from messages where dialog_id = $dialog[dialog_id] order by message_timestamp desc limit 1");
    $response[] = array_merge($dialog, $message ?: []);
}

success($response);
