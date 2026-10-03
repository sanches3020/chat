<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");

$subs = selectList("subs", "dialog_id", ["user_id" => $user_id]);

$response = [];

foreach ($subs as $sub)
    $response[] = row("dialogs", ["dialog_id" => $sub]);


if (sizeof($subs) == 0)
    $subs[] = 0;

$top = selectListSql("select dialog_id from dialogs where dialog_id not in (" . implode(",", $subs) . ") order by dialog_rate desc limit 10");

foreach ($top as $top_id)
    $response[] = row("dialogs", ["dialog_id" => $top_id]);

success($response);
