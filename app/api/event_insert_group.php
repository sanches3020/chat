<?php
require_once __DIR__ . "/event_utils.php";

$events = get_required("events");

foreach ($events as $key => $value) {
    track($key, $value);
}

success();
