<?php
$_SERVER['DOCUMENT_ROOT'] = "/app";
require_once __DIR__ . "/event_utils.php";

$words = select("words", []);

for ($step = 0; $step < 60; $step++) {
    foreach ($words as $word_row) {
        $word = $word_row['word'];

        if ($step === 0) {
            $candles = chart($word, "S", 10);

            if (count($candles) > 0) {
                $closes = array_column($candles, 'close');
                $medium = array_sum($closes) / count($closes);
            } else {
                $medium = 1.0;
            }

            $base_value = $medium * 0.98;
        } else {
            $base_value = chartValue($word, "S");
            if ($base_value == 0) {
                $base_value = 1.0;
            }
        }

        $random_percent = rand(-50, 50) / 1000;
        $new_value = $base_value * (1 + $random_percent);

        if ($new_value < 0.01) {
            $new_value = 0.01;
        }

        track($word, $new_value);
    }

    println("bot success end");
    sleep(1);
}

println("bot success end");
