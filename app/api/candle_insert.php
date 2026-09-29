<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

$key = get_required("key");
$value = get_required("value");

$timestamp = time();
$periods = [
    "M" => 60,
    "H" => 3600,
    "D" => 86400
];

foreach ($periods as $name => $sec) {
    $period_time = floor($timestamp / $sec) * $sec;
    $last = select("candles", "*", ["key" => $key, "period" => $name, "time" => $period_time]);
    if ($last == null) {
        insert("candles", [
            "key" => $key,
            "period" => $name,
            "time" => $period_time,
            "low" => $value,
            "high" => $value,
            "open" => $value,
            "close" => $value
        ]);
    } else {
        update("candles", [
            "low" => min($last["low"], $value),
            "high" => max($last["high"], $value),
            "close" => $value
        ], ["id" => $last["id"]]);
    }
}

success();
