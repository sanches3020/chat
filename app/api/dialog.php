<?php
require_once __DIR__ . '/auth.php';

$dialog_id = get_long_required("dialog_id");

$response["dialog"] = row("dialogs", ["dialog_id" => $dialog_id]);

$response["users"] = array_to_map(selectSql("
select t2.*
from subs t1
    left join users t2 on t2.user_id = t1.user_id
where t1.dialog_id = $dialog_id"), "user_id");

$response["messages"] = select("messages", ["dialog_id" => $dialog_id], get_order("message_timestamp") . get_limits(30));

success($response);
