<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/utils/php/db.php";

$response = selectSql("select * from events order by event_timestamp desc limit 10");

success($response);