<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");
$dialog_id = get_long_required("dialog_id");

if (exists("subs", ["user_id" => $user_id, "dialog_id" => $dialog_id]))
    error("вы уже подписаны");

insert("subs", [
   "user_id" => $user_id,
   "dialog_id" => $dialog_id,
]);

success();
