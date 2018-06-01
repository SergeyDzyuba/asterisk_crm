<?php

require_once 'modules/Asterisk/ext/extraRestUtils.php'; // Подключаем класс для глобального поиска
global $db;

$extraRestUtils = new extraRestUtils(); // в БД по контактам, предв. контактам и контрагентам.
$id = $_POST['id'];
$query = 'select number_from, date from asterisk_calls where operator = "' . $id . '" order by date desc limit 1 ';
$cid = '';
$date = '';
$res = $db->query($query);
$row = $db->fetchByAssoc($res);
$cid = $row['number_from']; //номер клиента
$date = $row['date']; //дата звонка

$cid = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $cid);

if (strlen($cid) > 5) {
    $result = $extraRestUtils->getParentByCID($cid); // Осуществляем поиск контактов/конкурентов...
} else {
    $res = $extraRestUtils->getUserByCID($cid);
    $result['Users'] = array('parent_type' => 'Users', 'parent_id' => $res); // Осуществляем поиск пользователя
};

// Формируем ссылки и имена пользователей:
if (!empty($result['Contacts'])) { // Для контактов.
    if ($contact = fetchUserData($result['Contacts'], $beanList)) {
        $alert['contact_link'] = 'index.php?module=Contacts&action=DetailView&record=' . $contact['id'];
        $alert['contact_name'] = $contact['name'];
    }
} else {
    $alert['contact_link'] = 'index.php?module=Contacts&action=EditView&return_module=Contacts&return_action=index&phone_mobile=' . $cid;
    $alert['contact_name'] = 'Создать';
}

$link = '<b>Номер клиента: </b><span class="asterisk_number">' . $cid . '</span>
<a href="#" class="outboundCall" title="Создать вызов" target="_blank" style="text-decoration: none; opacity: 0; cursor: default;">
	<img src="modules/Asterisk/img/call_active.gif" />
</a>
<br />
<b>Дата:</b> <span class="asterisk_date">' . $date . '</span>
<hr />
<b>Физ.лицо:</b> <a href="' . $alert['contact_link'] . '" class="asterisk_contact">' . $alert['contact_name'] . '</a>
<br />';

echo $link;

/**
 * We receive the data of the user who calls us
 * @param array $data
 * @param object $beanList
 * @return array
 */
function fetchUserData($data, $beanList)
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

/**
 * We receive the data of the user who calls us
 * @param array $data
 * @param object $beanList
 * @return array
 */
function fetchUserD($data, $beanList)
{
    $focus = new User();
    $focus->retrieve($data['parent_id']);

    return array(
        'id' => $focus->id,
        'name' => $focus->first_name . ' ' . $focus->last_name,
    );
}
