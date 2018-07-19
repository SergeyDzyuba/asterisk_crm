<?php

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

require_once 'modules/Asterisk/ext/extraRestUtils.php';

global $sugar_config, $db, $beanList, $timedate;

file_put_contents("_node.log", "got incoming uid=" . $_POST['unique_id'] . " lid=" . $_POST['linked_id'] . PHP_EOL, FILE_APPEND);

$date = date('Y-m-d H:i:s');
$parent = array();
$GLOBALS['log']->logLevel($_POST);
if (!empty($_POST['number'])) {
    $operator = substr(str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $_POST['operator']), -10);
    $number = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $_POST['number']); // Приведем в порядок наш номер.
    $util = new extraRestUtils();
    $parent = $util->getParentByCID($number); // Получим обладателей данного номера.
}

$user_id = $_POST['user_id'];

if (strlen($operator) == 10) {
    $q = "select id from users where deleted = 0 and char_length(phone_mobile) > 8 and substring(phone_mobile,-10) = '{$operator}' limit 1";
    $res = $db->query($q);
    if ($row = $db->fetchByAssoc($res)) {
        $user_id = $row['id'];
    }
}

if (strlen($operator) == 3) {
    $q = "select id from users where deleted = 0 and asterisk_extension = '{$operator}' limit 1";
    $res = $db->query($q);
    if ($row = $db->fetchByAssoc($res)) {
        $user_id = $row['id'];
    }
}

$u = new User();
$u->retrieve($user_id);

// Определяем значения переменных по умолчанию:
$date_start = $date;
$date_end = $date;
$duration_hours = 0;
$duration_minutes = 0;
$duration_seconds = 0;
$status = 'Not Held';

if (!empty($_POST)) { // Если POST пришел, то мы можем предположить, что звонок состоялся.
    $unique_id = $_POST['unique_id'];
    $linked_id = $_POST['linked_id'];

    if ($startDate = getEventDate('BRIDGE_ENTER', $unique_id, $db)) {
        $date_start = $startDate;
    } elseif ($startDate = getEventDate('APP_START', $unique_id, $db)) {
        $date_start = $startDate;
    } elseif ($startDate = getEventDate('CHAN_START', $unique_id, $db)) {
        $date_start = $startDate;
    }

    if ($endDate = getEventDate('BRIDGE_EXIT', $unique_id, $db)) {
        $date_end = $endDate;
    }

    if ($startDate && $endDate) { // Если звонок состоялся.
        if ($time = differenceDate($startDate, $endDate)) { // Вычислим длительность разговора.
            // Для точного времени:
            $duration_hours = ($time['hours'] ? $time['hours'] : 0);
            $duration_minutes = ($time['minuts'] ? $time['minuts'] : 0);
            $duration_seconds = ($time['seconds'] ? $time['seconds'] : 0);
        }

        $status = 'Held';
    }
}

// Сохраняем звонок:
$call = new Call();

// Ищем сохраненный звонок с таким uid
$sql = "SELECT id FROM calls WHERE unique_id = '" . $_POST['unique_id'] . "' AND deleted = 0";
$res = $db->query($sql);

if ($row = $db->fetchByAssoc($res)) {
    $call->retrieve($row['id']);
}

$call->name = trim($sugar_config['asterisk_call_name_prefix']) . ' ' . $_POST['number'];

if (strlen($_POST['number']) === false) {
    $call->name = "Разговор не состоялся";
}

$call->phone = $number;
$call->operator = $operator;
$call->fio_tel = $number;
$call->unique_id = $unique_id;
$call->linked_id = $linked_id;
$call->date_entered = $timedate->handle_offset($date_start, $timedate->get_db_date_time_format(), true, $u);
$call->date_modified = $timedate->handle_offset($date_start, $timedate->get_db_date_time_format(), true, $u);
$call->modified_user_id = $user_id;
$call->created_by = $user_id;
$call->assigned_user_id = $user_id;
$call->duration_hours = $duration_hours;
$call->duration_minutes = $duration_minutes;
$call->duration_seconds = $duration_seconds;
$call->date_start = $timedate->handle_offset($date_start, $timedate->get_db_date_time_format(), true, $u);
$call->date_end = $timedate->handle_offset($date_start, $timedate->get_db_date_time_format(), true, $u);
$call->status = $status;
$call->direction = $_POST['direction'];

if (isset($_POST['source'])) {
    $call->description = $_POST['source'];
}

if (!empty($parent) && count($parent) > 0) { // Если в Шуге существуют нужные пользователи, то сохраняем звонок.
    $parent_type = '';
    $parent_id = '';

    // Иерархия привязки звонка:
    if (!empty($parent['Contacts'])) {
        $parent_type = $parent['Contacts']['parent_type'];
        $parent_id = $parent['Contacts']['parent_id'];
    } elseif (!empty($parent['Leads'])) {
        $parent_type = $parent['Leads']['parent_type'];
        $parent_id = $parent['Leads']['parent_id'];
    } elseif (!empty($parent['Accounts'])) {
        $parent_type = $parent['Accounts']['parent_type'];
        $parent_id = $parent['Accounts']['parent_id'];
    }

    if (!empty($parent_type) && !empty($parent_id)) { // Проверяем наличие необходимых нам данных.
        $call->parent_type = $parent_type;
        $call->parent_id = $parent_id;

        if ($user = fetchUserData($parent_type, $parent_id, $beanList)) { // Достаем имя пользователя, чтоб использовать его в имени звонка.
            //$call->name = trim($sugar_config['asterisk_call_name_prefix']) . ' ' . $user['name']; // Переопределяем имя звонка.
        }
    }
}

if ($status == 'Held') { // Если звонок состоялся, то сохраняем путь к записи разговора.
    if (!empty($sugar_config['asterisk_audio_path']) && !empty($sugar_config['asterisk_audio_format'])) { // Смотрим, указаны ли все необходимые данные в настройках.
        $last_symbol = mb_substr($sugar_config['asterisk_audio_path'], -1);
        if ($last_symbol != '/') { // Удаляем слэш, если он имеется, в конце указанного пути.
            $audio_path = $sugar_config['asterisk_audio_path'];
        } else {
            $audio_path = mb_substr($sugar_config['asterisk_audio_path'], 0, -1);
        }

        $call->asterisk_audio_file = $audio_path . $_POST['audio_file_name'];
    }
}

if ($call_id = $call->save()) {
    file_put_contents("_node.log", "saved incoming uid=" . $_POST['unique_id'] . " lid=" . $_POST['linked_id'] . " with system id = " . $call_id . PHP_EOL, FILE_APPEND);
    if (!empty($_POST['newstate_name'])) {
        saveCallId($call_id, $_POST['newstate_name'], $db);
    }
    $query1 = "UPDATE asterisk_calls SET save_id = '" . $call_id . "', actual = 1 WHERE unique_id = '" . $_POST['unique_id'] . "'";
    $res1 = $db->query($query1);
    //Фикс времени
    $query2 = "UPDATE calls SET date_entered = date_modified, date_end = date_modified, date_start = date_modified WHERE id = '" . $call_id . "' and deleted = 0";
    $db->query($query2);
}

// Создадим связи:
if (!empty($parent)) {
    foreach ($parent as $key => $value) {
        $title = strtolower($value['parent_type']);
        $call->load_relationship($title);
        $call->$title->add($value['parent_id']);
    }
}

// Уведомление о пропущенном
if ($status != "Held" && $direction == "Inbound") {
    $a = new Alert();
    $a->name = "Пропущенный вызов";
    $a->assigned_user_id = $call->assigned_user_id;
    $a->target_module = "Calls";
    $a->type = "info";
    $a->description = "Пропущенный вызов " . $call->name;
    $a->is_read = 0;
    $a->url_redirect = "/index.php?module=Calls&action=DetailView&record=" . $call->id;
    $a->save();
}

/**
 * fetch UserData
 * @param string $parent_type
 * @param string $parent_id
 * @param object $beanList
 * @return array
 */
function fetchUserData($parent_type, $parent_id, $beanList) // Получаем данные пользователя, который нам звонит.
{
    $focus = new $beanList[$parent_type];
    $focus->retrieve($parent_id);

    $user = new User();
    $user->retrieve($focus->assigned_user_id);

    return array(
        'id' => $focus->id,
        'name' => $focus->name,
    );
}

/**
 * get Event Date
 * @param string $event
 * @param string $unique_id
 * @param object $db
 * @return array
 */
function getEventDate($event, $unique_id, $db) // Функция получения даты начала/конца разговора.
{
    $query = "SELECT eventtime
		FROM asterisk_cel_nami
		WHERE eventname = '$event'
		AND unique_id = '$unique_id'";

    $result = $db->query($query);

    if ($row = $db->fetchByAssoc($result)) {
        return $row['eventtime'];
    }
}

/**
 * save CallId
 * @param string $call_id
 * @param string $newstate_name
 * @param object $db
 * @return object
 */
function saveCallId($call_id, $newstate_name, $db) // Функция сохранения id звонка. Нужно для всплывающего окошка в SugarCRM.
{
    $query = "UPDATE asterisk
		SET call_id = '$call_id'
		WHERE newstate_name = '$newstate_name'";

    return $db->query($query);
}

/**
 * difference Date
 * @param string $date_start
 * @param string $date_end
 * @return array
 */
function differenceDate($date_start, $date_end) // Функция вычисления разницы между датами.
{
    $unix_start = strtotime($date_start);
    $unix_end = strtotime($date_end);

    $difference = $unix_end - $unix_start;
    $time = array();

    $time['seconds'] = $difference % 60;
    $m = floor($difference / 60);
    $time['minuts'] = $m % 60;
    $h = floor($m / 60);
    $time['hours'] = $h % 24;

    return $time;
}
