<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

function track($key, $value)
{
    $timestamp = time();
    $period_name = "D";
    $period_time = floor($timestamp / 86400) * 86400;

    $last = row("candles", ["key" => $key, "period" => $period_name, "time" => $period_time], get_order('time', 'desc') . " limit 1");
    if ($last == null) {
        insert("candles", [
            "key" => $key,
            "period" => $period_name,
            "time" => $period_time,
            "low" => $value,
            "high" => $value,
            "open" => $value,
            "close" => $value,
        ]);
    } else {
        update("candles", [
            "low" => min($last["low"], $value),
            "high" => max($last["high"], $value),
            "close" => $value
        ], ["key" => $key,
            "period" => $period_name,
            "time" => $period_time,]);
    }
}

function chartValue($key)
{
    $last = row("candles", ["key" => $key, "period" => "D"], "order by time desc limit 1");
    if ($last != null)
        return $last["close"];
    return 0;
}

function chartStart($key)
{
    $last = row("candles", ["key" => $key, "period" => "D"], "order by time asc limit 1");
    if ($last != null)
        return $last["time"];
    return 0;
}

function chartMax($key)
{
    $last = row("candles", ["key" => $key, "period" => "D"], "order by high desc limit 1");
    if ($last != null)
        return $last["high"];
    return 0;
}

function balanceKey($user_id)
{
    return "balance_" . $user_id;
}

function trackBalance($user_id, $balance)
{
    trackAccumulate(balanceKey($user_id), $balance);
}

function trackAccumulate($key, $value = 1)
{
    track($key, chartValue($key) + $value);
}

function chart($key, $limit)
{
    $candles = select("candles", ["key" => $key, "period" => "D"], get_order("time") . get_limits($limit));
    return array_reverse($candles);
}