<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/auth.php';

$user_id = get_required("user_id");

$user = row("users", ["user_id" => $user_id]);
if (!$user) error("Неверный user_id");

success();
