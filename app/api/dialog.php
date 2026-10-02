<?php
require_once __DIR__ . '/auth.php';

$dialog_id = get_long_required("dialog_id");

$response["dialog"] = row("dialogs", ["dialog_id" => $dialog_id]);

$response["dialog"]["users_count"] = scalarSql(
    "select count(distinct user_id) from messages where dialog_id = " . (int)$dialog_id
);

$response["messages"] = selectSql(
    "select m.*, u.user_name from messages m" .
    " left join users u on u.user_id = m.user_id" .
    " where m.dialog_id = " . (int)$dialog_id .
    get_order("message_timestamp") . get_limits(30)
);

success($response);
