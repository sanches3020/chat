<?php
require_once __DIR__ . '/auth.php';

$dialog_id = get_long_required("dialog_id");

$messages = select("messages", [
    "dialog_id" => $dialog_id
], get_order("message_timestamp") . get_limits());

success($messages);
