<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/mems/utils/php/db.php';

$mem_id = get('mem_id');

if (!$mem_id) {
    error(['success' => false, 'error' => 'Нет данных']);
}

$result = query("INSERT INTO likes (mem_id, user_id) VALUES ('$mem_id', 1)");

success(['success' => true]);
