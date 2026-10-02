<?php
require_once __DIR__ . '/auth.php';

$word = get_string("word");

$response = select("fixes", ["word" => $word], get_order("fix_timestamp"));

success($response);
