<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");
$dialog_title = get_string_required("dialog_title");
$dialog_style = get_string_required("dialog_style");

$dialog_id = insert("dialogs", [
    "dialog_title" => $dialog_title,
    "dialog_style" => $dialog_style,
    "user_id" => $user_id,
]);

insert("subs", [
    "user_id" => $user_id,
    "dialog_id" => $dialog_id,
]);

success([
    "dialog_id" => $dialog_id,
]);