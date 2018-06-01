<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

global $current_user, $beanList, $db;

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

if (count($cookie) > 0) { // Проверим, нет ли текущих событий в куках.
    $rewrite = false; // Флаг на перезапись кук.
    $talk = false; // Флаг на обращение к БД для поиска входящего взонка.

    foreach ($cookie as $key => $value) { // Если есть, то пробежимся по каждому из них.
        $number = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $value['number']); // Приведем в порядок наш номер.
        $cookieCallId = $cookieName . '_' . $number; // Создадим название для кук с номером телефона.
        $call_id = isset($_COOKIE[$cookieCallId]) ? $_COOKIE[$cookieCallId] : ''; // Получим значение кук.

        if ($value['status'] == 0 || $value['status'] == 1) { // Обращаемся к БД, только если у события статус - 0(идет вызов) или 1(вызов принят).
            $talk = true; // Изменяем значение флага, чтоб знать, стоит ли нам искать входящие звонки в БД или нет.
            $status = getStatus($key, $db); // Получим статус события и, если есть, идентификатор автоматически сохраненного звонка.
            if ($value['status'] != $status['status']) {  // Если он отличается от того, которые уже есть, то...
                $cookie[$key]['status'] = $status['status']; // Обновляем статус у события.
                $cookie[$key]['call_id'] = $status['call_id']; // Обновляем идентификатор сохраненного звонка.

                if (empty($call_id)) {
                    setcookie($cookieName . '_' . $number, $status['call_id']);
                } // Создадим куку с id сохраненного звонка. Нужно для создания связей при создании клиентов/предв.клиентов/контрагентов.

                $rewrite = true; // Изменяем значение флага, чтоб знать, что нужно перезаписать куку.
            }
        } else {
            if ($cookie[$key]['call_id'] == '') { // Если идентификатор номера не успел обновиться, то...
                $status = getStatus($key, $db); // Получим статус события и, если есть, идентификатор автоматически сохраненного звонка.
                $cookie[$key]['call_id'] = $status['call_id']; // Обновляем идентификатор сохраненного звонка.

                if (empty($call_id)) {
                    setcookie($cookieName . '_' . $number, $status['call_id']);
                } // Создадим куку с id сохраненного звонка. Нужно для создания связей при создании клиентов/предв.клиентов/контрагентов.

                $rewrite = true; // Изменяем значение флага, чтоб знать, что нужно перезаписать куку.
            }
        }
    }

    if ($rewrite) {
        setcookie($cookieName, json_encode($cookie));
    } // Перезаписываем куки, если это требуется.
}

if (!$talk) { // Обращаемся в БД за поиском входящих только в том случае, если в настоящее время нет ни одного входящего(0) или принятого(1) вызова.
    $data = getData($current_user, $db, $beanList, $cookie); // Смотрим, не звонит ли нам кто-нибудь сейчас.

    if (count($data) == 1) { // Если звонит, то...
        foreach ($data as $key => $value) { // Пробегаемся по всем элементам массива (в массиве 1 элемент).
            $cookie[$key] = $value; // И добавляем элемент в куки.
        }

        setcookie($cookieName, json_encode($cookie)); // Перезаписываем куки, на случай, если в них нужно добавить данные.
    }
}

if (count($cookie) > 0) { // Итак, проверяем теперь, есть ли у нас что-то в куках...
    echo json_encode($cookie); // Если что-то есть, то пакажем это JS-скрипту.
}

/**
 * Get Data
 * @param object $current_user
 * @param object $db
 * @param object $beanList
 * @param array $cookie
 * @return array
 */
function getData($current_user, $db, $beanList, $cookie) // Получение всех необходимых данных о звонящем пользователе.
{
    if ($incomingCall = incomingCall($current_user->asterisk_extension, $db)) { // Проверяем, звонит кто-то сейчас нам или нет, если да, то заходим в условие.
        if (!in_array($incomingCall['id'], array_keys($cookie))) { // Смотрим, нет содержат ли куки еще этого элемента.
            $alert = array(
                $incomingCall['id'] => array(
                    'status' => 0,
                    'number' => $incomingCall['number_from'],
                    'date' => $incomingCall['date'],
                    'call_id' => '',
                    'dial_buttons' => $current_user->asterisk_dial_buttons,
                ),
            );

            require_once 'modules/Asterisk/ext/extraRestUtils.php'; // Подключаем класс для глобального поиска
            $extraRestUtils = new extraRestUtils();     // в БД по контактам, предв. контактам и контрагентам.

            $cid = urldecode($incomingCall['number_from']);
            $cid = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $cid);

            $result = $extraRestUtils->getParentByCID($cid); // Осуществляем поиск.
            // Формируем ссылки и имена пользователей:
            if (!empty($result['Contacts'])) { // Для контактов.
                if ($contact = fetchUserData($result['Contacts'], $beanList)) {
                    $alert[$incomingCall['id']]['contact_link'] = 'index.php?module=Contacts&action=DetailView&record=' . $contact['id'];
                    $alert[$incomingCall['id']]['contact_name'] = $contact['name'];
                }
            } else {
                $alert[$incomingCall['id']]['contact_link'] = 'index.php?module=Contacts&action=EditView&return_module=Contacts&return_action=index&phone=' . $incomingCall['number_from'];
                $alert[$incomingCall['id']]['contact_name'] = 'Создать';
            }

            if (!empty($result['Accounts'])) { // Для контрагентов.
                if ($account = fetchUserData($result['Accounts'], $beanList)) {
                    $alert[$incomingCall['id']]['account_link'] = 'index.php?module=Accounts&action=DetailView&record=' . $account['id'];
                    $alert[$incomingCall['id']]['account_name'] = $account['name'];
                }
            } else {
                $alert[$incomingCall['id']]['account_link'] = 'index.php?module=Accounts&action=EditView&return_module=Accounts&return_action=index&phone=' . $incomingCall['number_from'];
                $alert[$incomingCall['id']]['account_name'] = 'Создать';
            }

            if (!empty($result['Leads'])) { // Для предварительных контактов.
                if ($lead = fetchUserData($result['Leads'], $beanList)) {
                    $alert[$incomingCall['id']]['lead_link'] = 'index.php?module=Leads&action=DetailView&record=' . $lead['id'];
                    $alert[$incomingCall['id']]['lead_name'] = $lead['name'];
                }
            } else {
                $alert[$incomingCall['id']]['lead_link'] = 'index.php?module=Leads&action=EditView&return_module=Leads&return_action=DetailView&phone=' . $incomingCall['number_from'];
                $alert[$incomingCall['id']]['lead_name'] = 'Создать';
            }

            return $alert;
        }
    }
}

/**
 * get Status
 * @param string $event_id
 * @param object $db
 * @return array
 */
function getStatus($event_id, $db) // Получаем статус звонка.
{
    $query = "SELECT status, call_id
		FROM asterisk
		WHERE id = '$event_id'";

    $result = $db->query($query);
    $row = $db->fetchByAssoc($result);

    return $row;
}

/**
 * Incoming Call
 * @param string $extension
 * @param object $db
 * @return array
 */
function incomingCall($extension, $db) // Смотрим, не звонит ли кто-нибудь нам в данный момент.
{
    $query = "SELECT id, number_from, date
		FROM asterisk
		WHERE operator = '$extension'
			AND status = 0
		ORDER BY date DESC
		LIMIT 1";

    $result = $db->query($query);

    return $db->fetchByAssoc($result);
}

/**
 * Fetch UserData
 * @param array $data
 * @param object $beanList
 * @return array
 */
function fetchUserData($data, $beanList) // Получаем данные пользователя, который нам звонит.
{
    $focus = new $beanList[$data['parent_type']];
    $focus->retrieve($data['parent_id']);

    $user = new User();
    $user->retrieve($focus->assigned_user_id);

    return array(
        'id' => $focus->id,
        'name' => $focus->name,
    );
}
