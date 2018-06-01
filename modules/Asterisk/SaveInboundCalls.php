<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

global $sugar_config, $current_user;

// Переименовываем звонок:
if (!empty($_REQUEST['name'])) {
    
    $call = new Call();
    $call->retrieve($_REQUEST['call_id']);
    $call->description = $_REQUEST['name'];

    if ($call_id = $call->save()) {
        echo json_encode(array('call_id' => $call_id));
    }
}
