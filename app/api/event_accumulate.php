<?php
require_once __DIR__ . "/event_utils.php";

$key = get_required("key");

trackAccumulate($key);

success();
