<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */
 
$dictionary['User']['fields']['asterisk_extension'] = array(
    'name' => 'asterisk_extension',
    'vname' => 'LBL_ASTERISK_EXTENSION',
    'type' => 'varchar',
    'len' => 255,
    'required' => false,
);

$dictionary['User']['fields']['asterisk_dial_buttons'] = array(
    'name' => 'asterisk_dial_buttons',
    'vname' => 'LBL_ASTERISK_DIAL_BUTTONS',
    'type' => 'bool',
);

$dictionary['User']['fields']['asterisk_call_notification'] = array(
    'name' => 'asterisk_call_notification',
    'vname' => 'LBL_ASTERISK_CALL_NOTIFICATION',
    'type' => 'bool',
);

$dictionary['User']['fields']['asterisk_notifier_enabled'] = array(
    'name' => 'asterisk_notifier_enabled',
    'vname' => 'LBL_ASTERISK_NOTIFIER_ENABLED',
    'type' => 'bool',
);

$dictionary['User']['fields']['asterisk_softphone'] = array(
    'name' => 'asterisk_softphone',
    'vname' => 'LBL_ASTERISK_SOFTPHONE',
    'type' => 'bool',
);

$dictionary['User']['fields']['asterisk_password'] = array(
    'name' => 'asterisk_password',
    'vname' => 'LBL_ASTERISK_PASSWORD',
    'type' => 'varchar',
    'len' => 255,
    'required' => true,
);
