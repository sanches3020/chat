<?php
require_once __DIR__ . '/event_utils.php';

$search_text = get_string("search_text");
$limit = get_long("limit") ?: 15;

$words = selectSql("select * from words where word like '%" . uencode($search_text ?? "") . "%' order by word_rate desc limit " . $limit);

success($words);
