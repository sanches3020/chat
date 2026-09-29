<?php
require_once __DIR__ . '/auth.php';

$search_text = get_string("search_text");

$data = [
    ["word" => "sdf1", "price" => 123, "price24" => 4.2],
    ["word" => "wefwefwe2f", "price" => 22, "price24" => 1.2],
    ["word" => "sf3f2q3f", "price" => 1, "price24" => 0.2],
    ["word" => "2cscce", "price" => 31, "price24" => 66.2],
];

if (!empty($search_text)) {
    $filtered = [];
    foreach ($data as $item) {
        if (stripos($item['word'], $search_text) !== false) {
            $filtered[] = $item;
        }
    }
    $data = $filtered;
}

success($data);
