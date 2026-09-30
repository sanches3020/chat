<?php
require_once __DIR__ . '/auth.php';

$token = get_long_required("token");

$response["user"] = row("users", ["user_id" => $token]);
$response["stats"] = select("stats", ["user_id" => $token], get_order("amount") . get_limits(30));

success($response);
