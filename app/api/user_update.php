<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");
$user_name = get("user_name");

update("users", ["user_name" => $user_name], ["user_id" => $user_id]);

success();
