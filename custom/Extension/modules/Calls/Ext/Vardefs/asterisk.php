<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

$dictionary['Call']['fields']['asterisk_audio_file'] = array(
    'name' => 'asterisk_audio_file',
    'vname' => 'LBL_ASTERISK_AUDIO_FILE',
    'dbType' => 'varchar',
    'type' => 'link',
    'link_target' => '_blank',
    'len' => 255,
);

$dictionary['Call']['fields']['duration_seconds'] = array(
    'name' => 'duration_seconds',
    'vname' => 'LBL_DURATION_SECONDS',
    'type' => 'int',
    'len' => '2',
    'comment' => 'Call duration, seconds portion',
    'required' => true,
);

$dictionary['Call']['fields']['phone'] = array(
    'name' => 'phone',
    'vname' => 'LBL_PHONE',
    'type' => 'varchar',
    'len' => '25',
    'required' => false,
);

$dictionary['Call']['fields']['unique_id'] = array(
    'name' => 'unique_id',
    'vname' => 'LBL_UNIQUE_ID',
    'type' => 'varchar',
    'len' => '30',
    'required' => false,
);

$dictionary['Call']['fields']['linked_id'] = array(
    'name' => 'linked_id',
    'vname' => 'LBL_LINKED_ID',
    'type' => 'varchar',
    'len' => '30',
    'required' => false,
);

$dictionary['Call']['fields']['phone_additional'] = array(
    'name' => 'phone_additional',
    'vname' => 'LBL_PHONE_ADDITIONAL',
    'dbtype' => 'varchar',
    'type' => 'phone',
    'len' => '25',
    'required' => false,
);