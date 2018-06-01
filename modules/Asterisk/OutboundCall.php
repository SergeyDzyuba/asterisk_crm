<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

global $sugar_config, $current_user;

require_once 'modules/Asterisk/ext/utils.php';
require_once 'modules/Asterisk/ext/extraRestUtils.php';

$socket = fsockopen($sugar_config['asterisk_host'], intval($sugar_config['asterisk_port']), $errno, $errstr, 20); // Открываем сокет.

if (!$socket) {
    exit("Error $errno : $errstr");
}

$number = $_REQUEST['phone'];
$number = str_replace("+", "00", $number);
$number = str_replace(array("(", ")", " ", "-", "/", ".", '[', ']'), "", $number); // Приводим номер в порядок.

$contact_name = ''; // По умолчание задаем пустое имя.
$util = new extraRestUtils();
$parent = $util->getParentByCID($number); // Получаем идентификаторы контактов, предварительных контактов и контрагентов, если таковые(с этим номером) имеются в БД.

if (!empty($parent)) { // Если мы нашли хоть какой-то контакт, то...
    
    foreach ($parent as $key => $value) { // Пробегаемся по контактам.
        if (!empty($value['parent_id']) && !empty($value['parent_type'])) { // Проверяем наличие необходимых нам данных.
            $focus = new $beanList[$value['parent_type']];
            $focus->retrieve($value['parent_id']);
            
            if ($value['parent_type'] == 'Accounts') {
                $name = $focus->name;
            } else {
                $name = $focus->full_name;
            }
            
            $contact_name = ciril_to_lat($name); // Получаем имя контакта латиницей.
            break; // По остальным объектам пробегаться не имеет смысла, т.к. у нас уже есть имя контакта. Выходим из цикла.
        }
    }
}

$number = $sugar_config['asterisk_dialout_prefix'] . $number; // Получаем номер.

if (empty($number)) {
    exit("Номер не был указан.");
}


fputs($socket, "Action: Login\r\n");
fputs($socket, "Username: " . $sugar_config['asterisk_user'] . "\r\n");
fputs($socket, "Secret: " . $sugar_config['asterisk_pass'] . "\r\n");
fputs($socket, "\r\n");
fputs($socket, "Action: originate\r\n");
fputs($socket, "Channel: SIP/{$current_user->asterisk_extension}\r\n");
fputs($socket, "Context: {$sugar_config['asterisk_context']}\r\n");
fputs($socket, "Exten: $number\r\n");
fputs($socket, "Priority: 1\r\n");
fputs($socket, "CallerID: \"{$contact_name} <{$current_user->asterisk_extension}>\"\r\n");
fputs($socket, "Action: Logoff\r\n\r\n");
fputs($socket, "\r\n");

echo fgets($socket, 128); // Получаем наш сокет.

sleep(1); // Ставим задержку в одну секунду.

fclose($socket); // Закрываем сокет.
