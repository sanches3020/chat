<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

function track($key, $value) {
    $timestamp = time();
    $periods = [
        "M" => 60,
        "H" => 3600,
        "D" => 86400
    ];

    foreach ($periods as $name => $sec) {
        $period_time = floor($timestamp / $sec) * $sec;
        $last = row("candles", ["key" => $key, "period" => $name, "time" => $period_time], get_order('time', 'desc') . " limit 1");
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
}

function chartValue($key, $period = "D") {
    $last = row("candles", ["key" => $key, "period" => $period], get_order('time') . " limit 1");
    if ($last != null)
        return $last["close"];
    return 0;
}

function trackAccumulate($key, $value = 1){
    track("_" . $key, chartValue($value) + $value);
}