<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

require_once 'modules/Asterisk/ext/utils.php';
require_once 'modules/Asterisk/ext/extraRestUtils.php';

global $beanList;

$delimiter = '^';

if (isset($pwd_key_ast) && !empty($pwd_key_ast)) {
    if (!isset($_REQUEST['pwd']) || $_REQUEST['pwd'] != $pwd_key_ast) {
        die('PWD Error');
    }
}

if (empty($_REQUEST['cid'])) {
    die('Не был передан номер.');
}

$cid = urldecode($_REQUEST['cid']);
$cid = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-', '.'), '', $cid);

if (empty($cid)) {
    die('Ошибка в номере.');
}

$util = new extraRestUtils();
$parent = $util->getParentByCID($cid);

if (!empty($parent)) {
    foreach ($parent as $key => $value) {
        if (!empty($value['parent_id']) && !empty($value['parent_type'])) {
            $focus = new $beanList[$value['parent_type']];
            $focus->retrieve($value['parent_id']);

            $user = new User();
            $user->retrieve($focus->assigned_user_id);

            if ($value['parent_type'] == 'Accounts') {
                $name = $focus->name;
            } else {
                $name = $focus->full_name;
            }

            exit($user->asterisk_extension . $delimiter . ciril_to_lat($name));
        } else {
            exit();
        }
    }
}
