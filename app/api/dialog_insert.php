<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("user_id");
$dialog_title = get_string_required("dialog_title");

$dialog_id = insert("dialogs", [
    "dialog_title" => $dialog_title,
]);

insert("subs", [
    "user_id" => $user_id,
    "dialog_id" => $dialog_id,
]);

success([
    "dialog_id" => $dialog_id,
]);