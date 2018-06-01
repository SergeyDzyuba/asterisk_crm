<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2015 sugartalk.net | Andrey Z.
 */
 
$manifest = array(
    'acceptable_sugar_versions' => array(
    ),
    'acceptable_sugar_flavors' => array(
        0 => 'OS',
        1 => 'PRO',
        2 => 'ENT',
        3 => 'CE',
    ),
    'readme' => '',
    'name' => 'Asterisk',
    'description' => 'Asterisk integration!',
    'author' => 'sugartalk.net | Andrey Z.',
    'published_date' => '10/10/2015',
    'version' => '2.1',
    'type' => 'module',
    'is_uninstallable' => true,
);

$installdefs = array(
    'id' => 'Asterisk',
    'copy' => array(
        array(
            'from' => '<basepath>/modules/Asterisk',
            'to' => 'modules/Asterisk',
        ),
        array(
            'from' => '<basepath>/custom/Extension/modules/Administration/Ext/Administration/Asterisk.php',
            'to' => 'custom/Extension/modules/Administration/Ext/Administration/Asterisk.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/modules/Administration/Ext/Language/ru_ru.Asterisk.php',
            'to' => 'custom/Extension/modules/Administration/Ext/Language/ru_ru.Asterisk.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/modules/Users/Ext/Vardefs/asterisk.php',
            'to' => 'custom/Extension/modules/Users/Ext/Vardefs/asterisk.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/modules/Users/Ext/Language/ru_ru.asterisk.php',
            'to' => 'custom/Extension/modules/Users/Ext/Language/ru_ru.asterisk.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/modules/Calls/Ext/Vardefs/asterisk.php',
            'to' => 'custom/Extension/modules/Calls/Ext/Vardefs/asterisk.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/modules/Calls/Ext/Language/ru_ru.asterisk.php',
            'to' => 'custom/Extension/modules/Calls/Ext/Language/ru_ru.asterisk.php',
        ),
        array(
            'from' => '<basepath>/custom/include/SugarFields/Fields/Phone/DetailView.tpl',
            'to' => 'custom/include/SugarFields/Fields/Phone/DetailView.tpl',
        ),
        array(
            'from' => '<basepath>/custom/include/SugarFields/Fields/Phone/ListView.tpl',
            'to' => 'custom/include/SugarFields/Fields/Phone/ListView.tpl',
        ),        
        array(
            'from' => '<basepath>/PAMI',
            'to' => 'PAMI',
        ),
        array(
            'from' => '<basepath>/service/asterisk',
            'to' => 'service/asterisk',
        ),
        array(
            'from' => '<basepath>/custom/Extension/application/Ext/Include/Asterisk.php',
            'to' => 'custom/Extension/application/Ext/Include/Asterisk.php',
        ),
        array(
            'from' => '<basepath>/pamicel.php',
            'to' => 'pamicel.php',
        ),
        array(
            'from' => '<basepath>/server.php',
            'to' => 'server.php',
        ),
        array(
            'from' => '<basepath>/server.sh',
            'to' => 'server.sh',
        ),
        array(
            'from' => '<basepath>/pami.sh',
            'to' => 'pami.sh',
        ),
        array(
            'from' => '<basepath>/rel.php',
            'to' => 'rel.php',
        ),
        array(
            'from' => '<basepath>/class.PHPWebSocket.php',
            'to' => 'class.PHPWebSocket.php',
        ),
        array(
            'from' => '<basepath>/fancywebsocket.js',
            'to' => 'fancywebsocket.js',
        ),
            
    ),
    'entrypoints' => array(
        array(
            'from' => '<basepath>/custom/Extension/application/Ext/EntryPointRegistry/save_calls.php'
        )
    ),
    'logic_hooks' => array(
        array(
            'module' => 'Accounts',
            'hook' => 'after_save',
            'order' => 1,
            'description' => 'Создаем связи',
            'file' => 'modules/Asterisk/ext/AsteriskHooks.php',
            'class' => 'AsteriskHooks',
            'function' => 'relations',
        ),
        array(
            'module' => 'Contacts',
            'hook' => 'after_save',
            'order' => 1,
            'description' => 'Создаем связи',
            'file' => 'modules/Asterisk/ext/AsteriskHooks.php',
            'class' => 'AsteriskHooks',
            'function' => 'relations',
        ),
        array(
            'module' => 'Leads',
            'hook' => 'after_save',
            'order' => 1,
            'description' => 'Создаем связи',
            'file' => 'modules/Asterisk/ext/AsteriskHooks.php',
            'class' => 'AsteriskHooks',
            'function' => 'relations',
        ),
    ),
);
