<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("user_id");

$messages = select("subs", [
    "user_id" => $user_id
]);

success($messages);
