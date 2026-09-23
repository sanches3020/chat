<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/auth.php';

$dialog_id = get_required("dialog_id");

$messages = select("messages", [
    "message_dialog_id" => $dialog_id
]);

success($messages);
