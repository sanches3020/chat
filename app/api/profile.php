<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
log_enable();

$user_id = get_required("user_id");

$user = row("users", ["user_id" => $user_id]);

if (!$user) {
    error("Неверный user_id");
}

success($user);
