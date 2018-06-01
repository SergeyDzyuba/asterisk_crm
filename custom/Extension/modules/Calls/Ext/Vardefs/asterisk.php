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
