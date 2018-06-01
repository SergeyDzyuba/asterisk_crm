<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */
 
$admin_option_defs = array();
$admin_option_defs['Administration']['Asterisk'] = array('Calls', 'LBL_MANAGE_ASTERISK', 'LBL_ASTERISK', './index.php?module=Asterisk&action=Admin');
$admin_group_header[] = array('LBL_ASTERISK_TITLE', '', false, $admin_option_defs, 'LBL_ASTERISK_DESC');
