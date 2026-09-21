<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
log_enable();

$dialog_id = get_required("dialog_id");

$messages = select("messages", [
    "message_dialog_id" => $dialog_id
]);

return_json($messages);
