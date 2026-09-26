<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/utils/php/db.php';


$user_id = get_long_required("user_id");

$user = row("users", ["user_id" => $user_id]);

if ($user == null) {
    require_once __DIR__ . '/user_names.php';
    global $adjectives;
    global $nouns;
    $adjective = $adjectives[array_rand($adjectives)];
    $noun = $nouns[array_rand($nouns)];

    //error($adjective . ' ' . $noun);
    insert("users", [
        "user_id" => $user_id,
        "user_name" => $adjective . ' ' . $noun,
        "user_image" => "wef.png",
        "user_balance" => 50,
    ]);
}