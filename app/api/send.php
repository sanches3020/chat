<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("user_id");
$message_text = get_string_required("message_text");
$dialog_id = get_long("dialog_id");

if ($dialog_id == null) {

    require_once __DIR__ . '/dialog_names.php';
    global $adjectives;
    global $nouns;
    $adjective = $adjectives[array_rand($adjectives)];
    $noun = $nouns[array_rand($nouns)];

    $dialog_id = insert("dialogs", [
        "dialog_title" => $adjective . ' ' . $noun,
    ]);
}

insert("messages", [
    "user_id" => $user_id,
    "dialog_id" => $dialog_id,
    "message_text" => $message_text,
]);

success();
