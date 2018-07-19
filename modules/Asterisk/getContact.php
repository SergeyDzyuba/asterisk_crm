<?php

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

global $db, $current_user, $sugar_config, $beanList, $timedate;
$phone_number = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $_POST['phone_number']); // Приведем в порядок наш номер.

$response = array();

$contact = new Contact();
//$account = new Account();
if ($phone_number !== 'undefined' && !empty($phone_number)) {
   $query = "SELECT * FROM contacts WHERE (phone_work LIKE '%{$phone_number}%' OR phone_mobile LIKE '%{$phone_number}%') AND deleted=0 LIMIT 1";
   $result = $db->query($query);
   $row = $db->fetchByAssoc($result);
    $response['id'] = $row['id'];
    $response['full_name'] = $row['last_name'].' '.$row['first_name'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response);
} else {
    echo '-1';
}