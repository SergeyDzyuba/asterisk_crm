<?php

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

global $db, $current_user,$sugar_config, $beanList, $timedate;

//$GLOBALS['log']->logLevel($_POST);
//$phone_number = ($_POST['phone_number']!=='undefined')?str_replace('+7','8',$_POST['phone_number']):$_POST['phone_number'];
$phone_number = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $_POST['phone_number']); // Приведем в порядок наш номер.

$response = array();

$contact = new Contact();
$account = new Account();

if ($phone_number!=='undefined' && !empty($phone_number)){
    $query = "SELECT * FROM calls WHERE phone LIKE '%{$phone_number}%' AND deleted=0 ORDER BY date_modified DESC LIMIT 0,5";
    $result = $db->query($query);
    while ($row = $db->fetchByAssoc($result)){
        if ($row['parent_type']==='Contacts'){
            $contact->retrieve($row['parent_id']);
            $row['parent_name']=$contact->name;
        }
        else if ($row['parent_type']==='Accounts'){
            $account->retrieve($row['parent_id']);
            $row['parent_name']=$account->name;
        }
        //корректировка по часовому поясу
        if (isset($row['date_modified']) && !empty($row['date_modified'])){
//            $td = new TimeDate();
//            $localDate = $td->to_display_date_time($row['date_modified'], false, true, $current_user);
            $row['date_modified'] = date("Y-m-d H:i:s",strtotime('+3 hours', strtotime($row['date_modified'])));
        }
//        $row['client_name']=(empty($row['client_name']))?'<i>Нет данных</i>':$row['client_name'];
        $response[]=$row;
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
}
else {
    echo '-1';
}