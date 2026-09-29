<?php
require_once __DIR__ . '/auth.php';

$word = get_string("word");

$response = select("fixes", ["word" => $word], get_order("fix_timestamp"));

success([
    ["word" => "wef","fix" => "wef12"],
    ["word" => "we1ff","fix" => "wefwf312"],
    ["word" => "wefwef","fix" => "weewff12"],
    ["word" => "wwefef","fix" => "we3ff12"],
]);
