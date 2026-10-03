<?php
require_once __DIR__ . '/auth.php';

$response = rowSql("SELECT * FROM sentences ORDER BY RAND() LIMIT 1");

success($response);
