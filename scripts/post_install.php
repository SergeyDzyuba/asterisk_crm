<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

/**
 * Post install
 */
function post_install()
{
    if ($_REQUEST['mode'] == 'Install') {
        $GLOBALS['log']->info('Start Reporting tool post install functions');

        repair_and_rebuild();
        repair_and_rebuild(); // Вызывается два раза.

        $GLOBALS['log']->info('End Reporting tool post install functions');
    } else {
        $GLOBALS['log']->info('Start Reporting tool post uninstall functions');

        print_goodbye();

        $GLOBALS['log']->info('End Reporting tool post uninstall functions');
    }

    addIncludeJSAsterisk();
}

/**
 * Repair and rebuild
 * @return boolean
 */
function repair_and_rebuild()
{
    require_once('modules/Administration/QuickRepairAndRebuild.php');
    $repair_modules = array(
        'Asterisk',
    );

    $repair_actions = array(
        'clearAll',
    );

    $RepairAndClear = new RepairAndClear();
    $RepairAndClear->repairAndClearAll($repair_actions, $repair_modules, $autoexecute = true, $show_output = false);

    ACLAction::addActions('Asterisk');
    return true;
}

/**
 * Print goodbye
 * @global string $goodbye_html
 */
function print_goodbye()
{
    global $goodbye_html;
    echo $goodbye_html;
}

/**
 * Add to global hooks "include js asterisk"
 */
function addIncludeJSAsterisk()
{

    $filename = 'custom/modules/logic_hooks.php';

    if (file_exists($filename)) {

        $string = '$hook_array[\'after_ui_frame\'] = Array();';
        $addHook = '$hook_array[\'after_ui_frame\'][] = array(10, \'includeJS\', \'modules/Asterisk/ext/HookJs.php\', \'Hookjs\', \'includeJS\');';
        $init = true;
        $closeTag = false;

        $file = file($filename);

        foreach ($file as $key => $value) {

            $value = trim($value);

            if ($value == '?>') {

                $closeTag = $key;
            }

            if ($value == $string) {

                $init = false;
            }
        }

        if ($closeTag) {

            unset($file[$closeTag]);

            file_put_contents($filename, $file);
        }

        if ($init) {

            file_put_contents($filename, PHP_EOL . $string, FILE_APPEND);
            file_put_contents($filename, PHP_EOL . $addHook, FILE_APPEND);
        } else {

            file_put_contents($filename, PHP_EOL . $addHook, FILE_APPEND);
        }
    }
}
