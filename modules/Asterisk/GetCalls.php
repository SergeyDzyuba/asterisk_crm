<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

$enabled = false;

if ($enabled) {
    global $current_user, $db;

    $query = 'select "links", "status", "save_id", "unique_id" from asterisk_calls where operator = "' . $current_user->asterisk_extension . '" order by id desc limit 1';
    $res = $db->query($query);
    $row = $db->fetchByAssoc($res);

    $query1 = 'select "call_id" from asterisk where unique_id = "' . $row['unique_id'] . '" and event = "Dial" order by id desc limit 1';
    $res1 = $db->query($query1);
    $row1 = $db->fetchByAssoc($res1);

    $result[0]['links'] = $row['links'];
    $result[0]['status'] = $row['status'];
    $result[0]['save_id'] = $row1['call_id'];
    $result[0]['unique_id'] = $row['unique_id'];

    echo json_encode($result);
} else {
    echo 0;
}

// Получаем данные из кук, чтоб многократно не обращаться к БД:
$cookieName = 'asterisk_' . $current_user->asterisk_extension; // Создадим название основных кук.
$cookie = isset($_COOKIE[$cookieName]) ? json_decode($_COOKIE[$cookieName], true) : array(); // Получим значение кук.

// Если закрыли окошко с сообщением, то удаляем куку, чтоб оно больше не всплывало, если у него статус не 0:
if (!empty($_GET['cookie_event_remove'])) {
    $event_id = $_GET['cookie_event_remove']; // Получаем идентификатор события.

    if ($cookie[$event_id]['status'] != 0) { // Не разрешаем закрывать окошко, если у события статус - 0(идет вызов).
        unset($cookie[$event_id]); // Удаляем событие из кук.
        setcookie($cookieName, json_encode($cookie)); // Обновим куку.
    }
}
