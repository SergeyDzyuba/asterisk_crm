<?php

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

//   [name] => adsf
//   [client_name] => asdf
//   [client_phone] => 89788274903
//   [parent_type] => Contacts
//   [parent_name] => Tanya Orchard
//   [parent_id] => 1722fdf3-56c1-81b8-af78-5b050d65a56a
//   [description] => asdf
global $db, $current_user,$sugar_config, $beanList, $timedate;
$name = $_POST['name'];
$status = $_POST['status'];
$client_name = $_POST['client_name'];
//$phone_num = ($_POST['client_phone']!=='undefined')?str_replace('+7','8',$_POST['client_phone']):$_POST['client_phone'];
$phone_num = str_replace(array(' ', '+',    '/', '(', ')', '[', ']', '-', '.'), '', $phone_num); // Приведем в порядок наш номер.
$parent_type = $_POST['parent_type'];
$parent_id = $_POST['parent_id'];
$parent_name = $_POST['parent_name'];
//$assigned_to = $_POST['assignet_to'];
$description = $_POST['description'];
$call = new Call();
if ($phone_num!=='undefined'){//если в запросе пришел телефон, то есть по чему искать в БД
//    $current_datetime = gmdate('Y-m-d H:i:s', time());
    $query = "SELECT id FROM calls WHERE phone LIKE '%".$phone_num."%' AND date_modified > DATE_SUB(UTC_TIMESTAMP, INTERVAL 1 HOUR) AND deleted=0 ORDER BY date_modified DESC LIMIT 1";
    $result = $db->query($query);
    if ($row = $db->fetchByAssoc($result)) {//есть запись о звонке в БД с таким номером за последний час, обновляем поля
        $call->retrieve($row['id']);
    }
    else {
//        $call->id = create_guid();
        $call->date_entered = gmdate('Y-m-d H:i:s');
        $call->date_modified = gmdate('Y-m-d H:i:s');
        $call->assigned_user_id = $current_user->id;
        $call->phone = $phone_num;
        $call->description = ' ЗВОНОК СОХРАНЕН ИЗ ВСПЛЫВАЮЩЕГО ОКНА ';
    }
        if (!empty($name)){
            $call->name = $name;
        }
        if (!empty($status)){
            $call->status = $status;
        }
        if (!empty($client_name)){
            $call->client_name = $client_name;
        }
        if (!empty($description)){
            $call->description .= $description;
        }
        if (!empty($parent_type) && !empty($parent_name) && !empty($parent_id) ){
            $call->parent_type=$parent_type;
            $call->parent_id=$parent_id;
        }
    $call->date_modified = gmdate('Y-m-d H:i:s');
    $call->assigned_user_id = $current_user->id;
        if ($call_id=$call->save()){
//            $GLOBALS['log']->logLevel('saved');
//            $GLOBALS['log']->logLevel($call_id);
        }
}