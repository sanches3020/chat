<?php
require_once __DIR__ . "/params.php";

global $mysqli;

if ($mysqli == null) {
    $mysqli = mysqli_init();
    $mysqli->real_connect(getenv('DB_HOST'), getenv('DB_USER'), getenv('DB_PASS'), getenv('DB_NAME'), getenv('DB_PORT'));
    $mysqli->set_charset("utf8mb4");

    if ($mysqli->connect_error)
        error("Connection failed: " . $mysqli->connect_error);
}


function querySilent($sql, $append = "", $show_query = false)
{
    if ($show_query)
        error($sql);
    global $mysqli;
    return $mysqli->query($sql . " " . $append);
}

function query($sql, $append = "", $show_query = false)
{
    $success = querySilent($sql, $append, $show_query);
    if (!$success) {
        global $mysqli;
        error(mysqli_error($mysqli));
    }
    return $success;
}

function cast_types($row)
{
    if (!$row) return $row;
    foreach ($row as $key => $value) {
        if (is_numeric($value)) {
            if (ctype_digit($value)) {
                $row[$key] = (int)$value;
            } else {
                $row[$key] = (float)$value;
            }
        }
    }
    return $row;
}

function selectSql($sql, $show_query = false)
{
    $rows = [];
    $result = query($sql, "", $show_query);
    if ($result->num_rows > 0)
        while ($row = $result->fetch_assoc())
            $rows[] = cast_types($row);
    return $rows;
}

function scalarSql($sql, $show_query = false)
{
    $rows = selectSql($sql, $show_query);
    if (count($rows) > 0)
        return array_shift($rows[0]);
    else
        return null;
}

function selectMapSql($sql, $column, $show_query = false)
{
    $table = selectSql($sql, $show_query);
    $res = [];
    foreach ($table as $row)
        $res[$row[$column]] = $row;
    return $res;
}

function selectMap($sql, $column, array $where, $append = "", $show_query = false)
{
    $table = select($sql, $where, $append);
    $res = [];
    foreach ($table as $row)
        $res[$row[$column]] = $row;
    return $res;
}

function selectListSql($sql, $show_query = false)
{
    $rows = [];
    $result = query($sql, "", $show_query);
    if ($result->num_rows > 0)
        while ($row = $result->fetch_assoc())
            $rows[] = array_shift($row);
    return $rows;
}

function selectList($table, $column, array $where, $append = "", $show_query = false)
{
    $select = select($table, $where, $append, $show_query); //!!! TODO optimize
    $rows = [];
    foreach ($select as $row)
        $rows[] = $row[$column];
    return $rows;
}

function rowSql($sql, $show_query = false)
{
    $result = selectSql($sql, "", $show_query);
    if (sizeof($result) != 0)
        return $result[0];
    return null;
}

function arrayToWhere(array $where)
{
    if ($where == null || sizeof($where) == 0) return "";
    $sql = " where ";
    foreach ($where as $param_name => $param_value)
        $sql .= is_double($param_name) ? $param_value :
            ("`$param_name`" . (is_null($param_value) ? " is null" : " = " . (is_double($param_value) ? $param_value : "'" . uencode($param_value) . "'"))) . " and ";
    return rtrim($sql, " and ");
}

function scalar($table, $field, array $where, $append = "", $show_query = false)
{
    return scalarSql("select $field from `$table` " . arrayToWhere($where) . " " . $append, $show_query);
}

function select($table, array $where, $append = "", $show_query = false)
{
    return selectSql("select * from `$table` " . arrayToWhere($where) . " " . $append, $show_query);
}

function row($table, array $where, $append = "", $show_query = false)
{
    return rowSql("select * from $table " . arrayToWhere($where) . " " . $append, $show_query);
}

function exists($table, array $where, $append = "", $show_query = false)
{
    return row($table, $where, $append, $show_query) != null;
}

function uencode($param_value)
{
    global $mysqli;
    return mysqli_real_escape_string($mysqli, $param_value);
}

function get_last_insert_id()
{
    global $mysqli;
    return mysqli_insert_id($mysqli);
}

function insert($table_name, array $params, $show_query = false)
{
    if (function_exists('on_before_insert'))
        on_before_insert($table_name, $params);
    $insert_params = "";
    foreach ($params as $param_name => $param_value)
        $insert_params .= (is_double($param_value) ? $param_value : (is_null($param_value) ? "null" : "'" . uencode($param_value) . "'")) . ", ";
    $insert_params = rtrim($insert_params, ", "); // !!! CHAR LSIT
    $success = query("insert into `$table_name` (`" . implode("`,`", array_keys($params)) . "`) values ($insert_params)", $show_query);
    if (function_exists('on_after_insert'))
        on_after_insert($table_name, $params);
    if ($success)
        return get_last_insert_id();
    return null;
}

function update($table_name, array $set_params, array $where, $show_query = false)
{
    if (function_exists('on_before_update'))
        on_before_update($table_name, $set_params, $where);
    $set_params_string = "";
    foreach ($set_params as $param_name => $param_value)
        $set_params_string .= (is_double($param_name) ? $param_value : " `$param_name` = " . (is_numeric($param_value) ? $param_value : (is_null($param_value) ? "null" : "'" . uencode($param_value) . "'"))) . ", ";
    $set_params_string = rtrim($set_params_string, ", "); // !!! CHAR LSIT
    query("update `$table_name` set $set_params_string " . arrayToWhere($where), "", $show_query);
    if (function_exists('on_after_update'))
        on_after_update($table_name, $set_params, $where);
}

function insertOrUpdate($table_name, $id_name, $id_value, array $params, $show_query = false)
{
    if (!exists($table_name, [$id_name => $id_value])) {
        insert($table_name, $params, $show_query);
    } else {
        update($table_name, $params, [$id_name => $id_value], $show_query);
    }
    return $id_value;
}


function random_id($length = 12)
{
    $random_long = (string)mt_rand(1, 9);
    for ($i = 0; $i < $length - 1; $i++)
        $random_long .= mt_rand(0, 9);
    return (int)$random_long;
}

function random_key($table_name, $column_name, $length = 9)
{
    do {
        $random_key_id = random_id($length);
        $key_exist = scalarSql("select count(*) from `$table_name` where $column_name = $random_key_id");
    } while ($key_exist != 0);
    return $random_key_id;
}

function string_id($id, $name = "")
{
    $hash = md5($id . $name);
    $sub = substr($hash, 0, 10);
    return hexdec($sub) % 1000000000000;
}

function str_between($string, $start, $end)
{
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

function commit($response = [success => true])
{
    if (function_exists('on_commit'))
        on_commit($response);
    success($response);
}


function get_order($order_by_default, $order_to_default = "DESC")
{
    $order_by = get_string(order_by);
    $order_to = get_string(order_to);
    if ($order_by !== null && $order_to !== null && in_array(strtoupper($order_to), ["ASC", "DESC"], true)) {
        return " ORDER BY `$order_by` $order_to";
    } else {
        return " ORDER BY $order_by_default $order_to_default";
    }
}

function get_limits()
{
    $page = get_long(page) ?: 1;
    $size = get_long(size) ?: 10;
    if ($page != (int)$page || $page <= 0)
        error("Invalid page number");
    if ($size != (int)$size && !in_array($size, [10, 25, 50, 100, 199]))
        error("Invalid page size");
    return " limit " . (($page - 1) * $size) . ", $size";
}

function get_pages()
{
    $page = get_long(page) ?: 1;
    $size = get_long(size) ?: 10;
    $total = scalarSql("SELECT FOUND_ROWS()");
    return [
        rows => $total,
        page => $page,
        size => $size,
        pages => ceil($total / $size) ?: 1
    ];
}