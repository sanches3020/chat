<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';
success();
$key = get_required("key");
$period_name = get_required("period_name");

$candles = select("candles", ["key" => $key, "period" => $period_name], "order by time desc limit 50");
$candles = array_reverse($candles);
$value = 0;
if ($candles != null) {
    $value = $candles[count($candles) - 1]["close"];
}

$history = select("candles", ["key" => $key, "period" => "H"], "order by time desc limit 25");
$change = 0;
if (count($history) > 1) {
    $change = $history[0]["close"] - $history[count($history) - 1]["close"];
}

echo json_encode([
    "candles" => $candles,
    "value" => $value,
    "change24" => $change
]);
