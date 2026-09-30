<?php
require_once __DIR__ . "/event_utils.php";

$key = get_string_required("key");
$period_name = get_string_required("period_name");

$candles = chart($key, $period_name, 50);

success($candles);
