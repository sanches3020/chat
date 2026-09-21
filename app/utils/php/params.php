<?php
error_reporting(1);

// TODO  is_numeric =>      is_numeric($result) && !is_string($result)
if (isset($_SERVER["CONTENT_TYPE"]) && $_SERVER["CONTENT_TYPE"] != 'application/x-www-form-urlencoded'
    && ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT')) {
    $inputJSON = file_get_contents('php://input');
    $inputParams = json_decode($inputJSON, true);
    foreach ($inputParams as $key => $value)
        $_POST[$key] = $value;
}

function println($msg, $data = null)
{
    return file_put_contents('php://stderr', gmdate("Y-m-d H:i:s") . " $msg " . ($data ? json_encode($data) : '') . "\n");
}

function error($error_message, $data = null)
{
    if ($GLOBALS[ignore_errors] == false && function_exists('on_error')) {
        $GLOBALS[ignore_errors] = true;
        on_error($error_message, $data);
    }
    //println($error_message, $data);
    $result["message"] = $error_message;
    if ($data != null)
        $result = array_merge($result, $data);
    /*if (getenv(APP_MODE) === 'dev')*/ {
    $stack = generateCallTrace();
    if ($stack != null)
        $result["stack"] = $stack;
}
    header("Content-type: application/json;charset=utf-8");
    http_response_code(500);
    die(json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function success($response = [success => true])
{
    http_response_code(200);
    header("Content-type: application/json;charset=utf-8");
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    die();
}


function generateCallTrace()
{
    function getExceptionTraceAsString($exception)
    {
        $rtn = "";
        foreach ($exception->getTrace() as $frame) {
            $args = "";
            if (isset($frame['args'])) {
                $args = [];
                foreach ($frame['args'] as $arg) {
                    if (is_string($arg)) {
                        $args[] = "'" . $arg . "'";
                    } elseif (is_array($arg)) {
                        $args[] = "Array";
                    } elseif (is_null($arg)) {
                        $args[] = 'NULL';
                    } elseif (is_bool($arg)) {
                        $args[] = ($arg) ? "true" : "false";
                    } elseif (is_object($arg)) {
                        $args[] = get_class($arg);
                    } elseif (is_resource($arg)) {
                        $args[] = get_resource_type($arg);
                    } else {
                        $args[] = $arg;
                    }
                }
                $args = join(", ", $args);
            }
            $frame['file'] = str_replace("\\", "/", $frame['file']);
            $frame['file'] = str_replace($_SERVER['DOCUMENT_ROOT'], "", $frame['file']);
            $rtn .= sprintf("%s(%s): %s(%s)\n",
                $frame['file'],
                $frame['line'],
                $frame['function'],
                $args);
        }
        return $rtn;
    }

    $e = new Exception();
    $trace = explode("\n", getExceptionTraceAsString($e));
    array_shift($trace);
    array_shift($trace);
    array_pop($trace);
    $result = [];
    for ($i = 0; $i < count($trace); $i++)
        $result[] = $trace[$i];
    return $result;
}

function get($param_name)
{
    $param_value = null;
    if ($param_value === null) {
        if ($GLOBALS[inputJsonCache] == null) {
            $inputJSON = file_get_contents('php://input');
            if ($inputJSON !== null) {
                $inputParams = json_decode($inputJSON, true);
                if ($inputParams !== null)
                    $GLOBALS[inputJsonCache] = $inputParams;
            }
        }
        if ($GLOBALS[inputJsonCache] != null) {
            $param_value = $GLOBALS[inputJsonCache][$param_name];
        }
    }
    if ($param_value === null)
        $param_value = $_GET[$param_name];
    if ($param_value === null)
        $param_value = $_POST[$param_name];
    if ($param_value === null)
        $param_value = $_SESSION[$param_name];
    if ($param_value === null)
        $param_value = $_COOKIE[$param_name];
    if ($param_value === null)
        $param_value = $_FILES[$param_name];
    /*if ($param_value === null)
        $param_value = array_change_key_case(getallheaders())[$param_name];*/
    if ($param_value === null)
        $param_value = $GLOBALS[$param_name];
    return $param_value;
}

function check_required($param_name, $param_value)
{
    if ($param_value === null)
        error("$param_name is empty");
    return $param_value;
}

function get_required($param_name)
{
    return check_required($param_name, get($param_name));
}

function field_required($object, $field_name)
{
    if ($object === null)
        error("object is empty");
    if ($object[$field_name] === null)
        error("$field_name is empty");
    return $object[$field_name];
}

// todo add check for sql injections
function string_value_check($param_name, $param_value)
{
    if ($param_value != null)
        return "$param_value";
    return null;
}

function string_check(array $object, $field_name)
{
    return string_value_check($field_name, $object[$field_name]);
}

function string_required(array $object, $field_name)
{
    return string_value_check($field_name, field_required($object, $field_name));
}

function get_string($param_name)
{
    $param_value = get($param_name);
    if ($param_value != null)
        return string_value_check($param_name, $param_value);
    return null;
}

function get_string_required($param_name)
{
    return get_required($param_name);
}

function number_value_check($param_name, $param_value, $precision)
{
    if ($param_value === null)
        return null;
    if (!is_numeric($param_value))
        error("$param_name must be number $param_value");
    $val = doubleval($param_value);
    if ($precision !== null && round($val, $precision) != $val)
        error("$param_name: max decimal places is $precision");
    return $val;
}

function number_check(array $object, $field_name, $precision)
{
    return number_value_check($field_name, $object[$field_name], $precision);
}

function number_required(array $object, $field_name, $precision = 0)
{
    return number_value_check($field_name, field_required($object, $field_name), $precision);
}

function get_number($param_name, $precision)
{
    $param_value = get($param_name);
    if ($param_value !== null && $param_value !== '')
        return number_value_check($param_name, $param_value, $precision);
    return null;
}

function get_number_required($param_name, $precision = 0)
{
    return check_required($param_name, get_number($param_name, $precision));
}

function long_value_check($param_name, $param_value)
{
    return number_value_check($param_name, $param_value, 0);
}

function long_check(array $object, $field_name)
{
    return number_check($object, $field_name, 0);
}

function long_required(array $object, $field_name)
{
    return number_required($object, $field_name, 0);
}

function get_long($param_name)
{
    return get_number($param_name, 0);
}

function get_long_required($param_name)
{
    return get_number_required($param_name, 0);
}

function bool_value_check($param_name, $param_value)
{
    if ($param_value === null)
        return null;
    $param_value = number_value_check($param_name, $param_value, 0);
    if ($param_value !== 0.0 && $param_value !== 1.0)
        error("$param_name must be 0 or 1");
    return $param_value;
}

function get_bool($param_name)
{
    $param_value = get($param_name);
    if ($param_value !== null && $param_value !== '')
        return bool_value_check($param_name, $param_value);
    return null;
}

function bool_check(array $object, $field_name)
{
    return bool_value_check($field_name, $object[$field_name]);
}

function bool_required(array $object, $field_name)
{
    return bool_value_check($field_name, field_required($object, $field_name));
}

function get_bool_required($param_name)
{
    return check_required($param_name, get_bool($param_name));
}

function enum_value_check($param_name, $param_value, array $enum)
{
    if ($param_value != null && !in_array($param_value, $enum, true))
        error("$param_name ($param_value) must  be in " . implode(', ', $enum));
    return $param_value;
}

function enum_required($object, $field_name, array $enum)
{
    return enum_value_check($field_name, field_required($object, $field_name), $enum);
}

function get_enum($param_name, array $enum)
{
    return enum_value_check($param_name, get_string($param_name), $enum);
}

function get_enum_required($param_name, array $enum)
{
    return enum_value_check($param_name, get_required($param_name), $enum);
}

function time_check($param_name, $param_value)
{
    $param_value = string_value_check($param_name, $param_value);
    $param_time = strtotime($param_value);
    if ($param_time < 1735689600)  // 2025-01-01 00:00:00 UTC
        error("$param_name ({$param_value}) must be >= 2025-01-01");
    if ($param_time > 2066332800)  // 2035-12-31 23:59:59 UTC
        error("$param_name ({$param_value}) must be <= 2035-12-31"); // todo remove timebomb
    return $param_value;
}

function time_required($object, $field_name)
{
    return time_check($field_name, field_required($object, $field_name));
}

function get_time($param_name)
{
    $param_value = get_string($param_name);
    if ($param_value != null)
        return time_check($param_name, $param_value);
    return null;
}

function get_time_required($param_name)
{
    $param_value = get_time($param_name);
    if ($param_value === null)
        error("$param_name is empty");
    return $param_value;
}

function get_long_list($param_name)
{
    $val = get_string($param_name);
    if ($val == null) return null;
    $items = explode(',', $val);
    foreach ($items as $item)
        long_value_check($param_name, trim($item));
    return $items;
}

function get_long_list_required($param_name)
{
    $val = get_long_list($param_name);
    if ($val === null)
        error("$param_name is empty");
    return $val;
}

function log_enable()
{
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL & ~E_WARNING & ~E_USER_WARNING & ~E_NOTICE & ~E_USER_NOTICE);
}

function trunc(float $number, int $places = 1): float {
    $power = 10 ** $places;
    return floor($number * $power) / $power;
}

function today($timezone)
{
    $date = new DateTime('now', new DateTimeZone($timezone ?: 'UTC'));
    return $date->format('Y-m-d');
}

function array_to_map($array, $key)
{
    $map = [];
    foreach ($array as $item)
        $map[$item[$key]] = $item;
    return $map;
}