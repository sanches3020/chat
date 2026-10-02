<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

function track($key, $value)
{
    $timestamp = time();
    $periods = [
        "S" => 1,
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

function chartValue($key, $period = "D")
{
    $last = row("candles", ["key" => $key, "period" => $period], get_order('time') . " limit 1");
    if ($last != null)
        return $last["close"];
    return 0;
}

function balanceKey($user_id)
{
    return "balance_" . $user_id;
}

function trackBalance($user_id, $balance)
{
    track(balanceKey($user_id), $balance);
}

function trackAccumulate($key, $value = 1)
{
    track($key, chartValue($key) + $value);
}

function chart($key, $period_name, $limit)
{
    $candles = select("candles", ["key" => $key, "period" => $period_name], get_order("time") . get_limits($limit));
    return array_reverse($candles);
}

function change24($key)
{
    $chart = chart($key, "D", 2);
    if (sizeof($chart) == 1)
        return ($chart[0]["close"] - $chart[0]["open"]) / $chart[0]["close"];
    if (sizeof($chart) == 2) {
        return ($chart[0]["close"] - $chart[1]["open"]) / $chart[0]["close"];
    }
    return 0;
}