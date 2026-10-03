<?php
require_once __DIR__ . '/auth.php';

for ($i = 0; $i < 10; $i++) {
    $response[] = rowSql("SELECT * FROM sentences ORDER BY RAND() LIMIT 1");
}

success($response);
