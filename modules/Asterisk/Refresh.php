<?php

global $db;

$linked_id = $_REQUEST['linked_id'];
$query = 'select number_from, status, save_id from asterisk_calls where linked_id = "' . $linked_id . '" OR unique_id = "' . $linked_id . '"';
$res = $db->query($query);
$row = $db->fetchByAssoc($res);
$status = $row['status']; //status
$save_id = $row['save_id']; //save_id

echo $status . "|" . $save_id;
