<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

$object_type = get_required("object_type");
$object_id = get_required("object_id");
$object_action = get_required("object_action");

$user_hash = get("user_hash");
$user_id = null;
if ($user_hash != null) {
    $user_id = scalar("users", "user_id", ["user_hash" => $user_hash]);
}

insert("events", [
    "user_id" => $user_id,
    "object_type" => $object_type,
    "object_id" => $object_id,
    "object_action" => $object_action,
]);

success();
