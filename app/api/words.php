<?php
require_once __DIR__ . '/auth.php';

$search_text = get_string("search_text");

$response = selectSql("select * from words where word like '%" . $search_text . "%'");

success($response);
