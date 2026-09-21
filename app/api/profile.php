<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
log_enable();

$user_hash = get_required("user_hash");

$user = row("users", ["user_hash" => $user_hash]);

if (!$user) {
    error("Неверный user_hash");
}

return_json($user);
