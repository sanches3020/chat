<?php
require_once __DIR__ . "/event_utils.php";

$key = get_string_required("key");
$limit = get_long("limit") ?: 50;

$candles = chart($key, $limit);

success($candles);
