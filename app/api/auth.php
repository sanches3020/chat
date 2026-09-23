<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

$user_hash = get_required("user_hash");

$user = row("users", ["user_hash" => $user_hash]);

if ($user == null)
    error("Неверный хеш");