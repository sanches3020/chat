<?php
require_once __DIR__ . "/event_utils.php";

$key = get_string_required("key");

$response["max"] = chartMax($key);
$response["start"] = chartStart($key);

success($response);
