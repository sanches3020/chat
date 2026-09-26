<?php
require_once __DIR__ . '/auth.php';

$token = get_long_required("token");

$user = row("users", ["user_id" => $token]);

success($user);
