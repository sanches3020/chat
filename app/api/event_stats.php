<?php
require_once __DIR__ . "/event_utils.php";

$key = get_string_required("key");

$response = selectSql("select 
    sum(`amount`) as cap, 
    count(distinct `user_id`) as holders  
from stats where `word` = $key");

$response["price"] = chartValue($key);

success($response);
