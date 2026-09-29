<?php
require_once __DIR__ . '/auth.php';

success([
    "words" => select("words", [], "order by word")
]);
