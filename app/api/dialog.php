<?php
require_once __DIR__ . '/auth.php';

$dialog_id = get_long_required("dialog_id");

$response["dialog"] = row("dialogs", ["dialog_id" => $dialog_id]);

$response["messages"] = select("messages", [
    "dialog_id" => $dialog_id
], get_order("message_timestamp") . get_limits(30));

success($response);
