<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

global $current_user;

if (!is_admin($current_user)) {
    sugar_die("Unauthorized access to administration.");
}

$prefix = 'asterisk_';
$settings_vars = array(
    $prefix . 'host' => array(
        'name' => $prefix . 'host',
        'type' => 'varchar',
        'required' => true,
        'vname' => 'LBL_' . strtoupper($prefix) . 'HOST',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'HOST_HLP',
        'default' => '127.0.0.1',
        'input_type' => 'text',
    ),
    $prefix . 'port' => array(
        'name' => $prefix . 'port',
        'type' => 'varchar',
        'required' => true,
        'vname' => 'LBL_' . strtoupper($prefix) . 'PORT',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'PORT_HLP',
        'default' => '5038',
        'input_type' => 'text',
    ),
    $prefix . 'user' => array(
        'name' => $prefix . 'user',
        'type' => 'varchar',
        'required' => true,
        'vname' => 'LBL_' . strtoupper($prefix) . 'USER',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'USER_HLP',
        'default' => '',
        'input_type' => 'text',
    ),
    $prefix . 'pass' => array(
        'name' => $prefix . 'pass',
        'type' => 'varchar',
        'required' => true,
        'vname' => 'LBL_' . strtoupper($prefix) . 'PASS',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'PASS_HLP',
        'default' => '',
        'input_type' => 'password',
    ),
    $prefix . 'regex' => array(
        'name' => $prefix . 'regex',
        'type' => 'varchar',
        'required' => true,
        'vname' => 'LBL_' . strtoupper($prefix) . 'REGEX',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'REGEX_HLP',
        'default' => '/^sip\/(.*)-/i',
        'input_type' => 'text',
    ),
    $prefix . 'dialout_prefix' => array(
        'name' => $prefix . 'dialout_prefix',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'DIALOUT_PREFIX',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'DIALOUT_PREFIX_HLP',
        'default' => '',
        'input_type' => 'text',
    ),
    $prefix . 'dialin_prefix' => array(
        'name' => $prefix . 'dialin_prefix',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'DIALIN_PREFIX',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'DIALIN_PREFIX_HLP',
        'default' => '',
        'input_type' => 'text',
    ),
    $prefix . 'call_name_prefix' => array(
        'name' => $prefix . 'call_name_prefix',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'CALL_NAME_PREFIX',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'CALL_NAME_PREFIX_HLP',
        'default' => 'Asterisk.',
        'input_type' => 'text',
    ),
    $prefix . 'context' => array(
        'name' => $prefix . 'context',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'CONTEXT',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'CONTEXT_HLP',
        'default' => '',
        'input_type' => 'text',
    ),
    $prefix . 'audio_path' => array(
        'name' => $prefix . 'audio_path',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'AUDIO_PATH',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'AUDIO_PATH_HLP',
        'default' => 'http://' . $_SERVER['HTTP_HOST'] . '/audio/',
        'input_type' => 'text',
    ),
    $prefix . 'audio_format' => array(
        'name' => $prefix . 'audio_format',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'AUDIO_FORMAT',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'AUDIO_FORMAT_HLP',
        'default' => 'mp3',
        'input_type' => 'text',
    ),
    $prefix . 'server_addr' => array(
        'name' => $prefix . 'server_addr',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'SERVER_ADDR',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'SERVER_ADDR_HLP',
        'default' => $_SERVER['SERVER_ADDR'],
        'input_type' => 'text',
    ),
    $prefix . 'http_host' => array(
        'name' => $prefix . 'http_host',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'HTTP_HOST',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'HTTP_HOST_HLP',
        'default' => $_SERVER['HTTP_HOST'],
        'input_type' => 'text',
    ),
    $prefix . 'notifier_port' => array(
        'name' => $prefix . 'notifier_port',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'NOTIFIER_PORT',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'NOTIFIER_PORT_HLP',
        'default' => '2410',
        'input_type' => 'text',
    ),
    $prefix . 'notifier_max_clients' => array(
        'name' => $prefix . 'notifier_max_clients',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'NOTIFIER_MAX_CLIENTS',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'NOTIFIER_MAX_CLIENTS_HLP',
        'default' => '10',
        'input_type' => 'text',
    ),
    $prefix . 'icq_number' => array(
        'name' => $prefix . 'icq_number',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'ICQ_NUMBER',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'ICQ_NUMBER_HLP',
        'default' => '',
        'input_type' => 'text',
    ),
    $prefix . 'icq_password' => array(
        'name' => $prefix . 'icq_password',
        'type' => 'varchar',
        'required' => false,
        'vname' => 'LBL_' . strtoupper($prefix) . 'ICQ_PASSWORD',
        'hlp_label' => 'LBL_' . strtoupper($prefix) . 'ICQ_PASSWORD_HLP',
        'default' => '',
        'input_type' => 'text',
    ),
);

global $sugar_config, $mod_strings, $app_strings;

$rewrite_config = false;

foreach ($settings_vars as $setting) {
    if (!isset($sugar_config[$setting['name']])) {
        $sugar_config[$setting['name']] = $setting['default'];
        $rewrite_config = true;
    }
}

if ($rewrite_config) {
    ksort($sugar_config);
    write_array_to_file('sugar_config', $sugar_config, 'config.php');
}

$configurator = new Configurator();

if (!empty($_POST['save'])) {
    // Fix bug #1:
    foreach ($settings_vars as $setting) {
        if ($setting['type'] == 'bool') {
            if (isset($_POST[$setting['name']]) and $_POST[$setting['name']] === 'true') {
                $_POST[$setting['name']] = true;
            } else {
                $_POST[$setting['name']] = false;
            }
        }
    }

    // Save settings:
    $configurator->saveConfig();
    header('Location: index.php?module=Administration&action=index');
}

require_once('include/Sugar_Smarty.php');
$sugar_smarty = new Sugar_Smarty();

$sugar_smarty->assign('MOD', $mod_strings);
$sugar_smarty->assign('APP', $app_strings);

$sugar_smarty->assign('sugar_config', $sugar_config);
$sugar_smarty->assign('vardefs', $settings_vars);
$sugar_smarty->assign('prefix', $prefix);

foreach ($settings_vars as $setting) {
    if (!isset($sugar_config[$setting['name']])) {
        $sugar_config[$setting['name']] = $setting['default'];
    }
}

$sugar_smarty->display('modules/Asterisk/tpl/Admin.tpl');

require_once("include/javascript/javascript.php");
$javascript = new javascript();
$javascript->setFormName("asterisk");

foreach ($settings_vars as $setting) {
    $javascript->addFieldGeneric($setting['name'], $setting['type'], $mod_strings[$setting['vname']], $setting['required'], "");
}

echo $javascript->getScript();
