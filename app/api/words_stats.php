<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/event_utils.php';

$search_text = get_string("search_text");

$stats["count"] = scalarSql("select count(*) from words");


success($stats);
