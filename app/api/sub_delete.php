<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");
$dialog_id = get_long_required("dialog_id");

query("delete from subs where user_id = $user_id and dialog_id = $dialog_id");

success();
