<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

$key = get_string_required("key");
$period_name = get_string_required("period_name");

$candles = select("candles", ["key" => $key, "period" => $period_name], "order by time desc limit 50");
$candles = array_reverse($candles);

success($candles);
