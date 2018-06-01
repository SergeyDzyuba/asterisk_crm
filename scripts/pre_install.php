<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

/**
 * Pre install
 */
function pre_install()
{
    if (check_already_install()) {
        sugar_die('Данный модуль уже установлен.');
    }
}

/**
 * Check already install
 * @return boolean
 */
function check_already_install()
{
    $uh = new UpgradeHistory();
    $uh->id_name = 'Asterisk';
    $result = $uh->checkForExisting($uh);

    if ($result != null) {
        return true;
    } else {
        return false;
    }
}
