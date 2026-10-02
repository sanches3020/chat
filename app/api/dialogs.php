<?php
require_once __DIR__ . '/auth.php';

$user_id = get_long_required("token");

$response = selectSql(
    "select d.*, m.user_id, m.message_id, m.message_text, m.message_result, m.message_timestamp, m.message_likes" .
    " from subs s" .
    " join dialogs d on d.dialog_id = s.dialog_id" .
    " left join messages m on m.message_id = (" .
    "     select m2.message_id from messages m2" .
    "     where m2.dialog_id = d.dialog_id" .
    "     order by m2.message_timestamp desc, m2.message_id desc limit 1" .
    " )" .
    " where s.user_id = " . (int)$user_id .
    " order by d.dialog_timestamp desc, d.dialog_id desc"
);

success($response);
