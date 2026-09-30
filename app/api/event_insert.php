<?php
require_once __DIR__ . "/event_utils.php";

$key = get_required("key");
$value = get_required("value");

track($key, $value);

$response["last"] = chartValue($key);

success($response);
