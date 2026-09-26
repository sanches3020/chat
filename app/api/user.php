<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("user_id");

$user = row("users", ["user_id" => $user_id]);

if ($user == null) error("Неверный user_id");

success($user);
