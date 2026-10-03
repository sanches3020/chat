<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/event_utils.php';

$search_text = get_string("search_text");

$words = selectSql("select * from words where word like '%" . uencode($search_text ?? "") . "%' order by word_rate desc");

foreach ($words as &$word) {
    $word["price"] = chartValue($word["word"]);
    $word["price24"] = change24($word["word"]);
}

success($words);
