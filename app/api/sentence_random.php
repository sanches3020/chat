<?php
require_once __DIR__ . '/auth.php';

$sentence_style = get_string("sentence_style") ?: 'congratulation';

$response = rowSql("SELECT * FROM sentences where sentence_style = '$sentence_style' ORDER BY RAND() LIMIT 1");

success($response);
