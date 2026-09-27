<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';

$user_id = get_long_required("token");

$user = row("users", ["user_id" => $user_id]);

if ($user == null) {
    $adjectives = ['иссушенный', 'невообразимый', 'таинственный', 'древний', 'светящийся', 'мрачный', 'золотой', 'ледяной', 'огненный', 'безумный'];
    $nouns = ['кролик', 'выдра', 'волк', 'дракон', 'кот', 'ворон', 'медведь', 'лис', 'ёж', 'филин'];

    $adjective = $adjectives[array_rand($adjectives)];
    $noun = $nouns[array_rand($nouns)];

    insert("users", [
        "user_id" => $user_id,
        "user_name" => $adjective . ' ' . $noun,
        "user_image" => "wef.png",
        "user_balance" => 50,
    ]);
}