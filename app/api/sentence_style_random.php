<?php
require_once __DIR__ . '/auth.php';

$response = selectListSql("SELECT distinct sentence_style FROM sentences");

$response = $response[array_rand($response)];

success($response);
