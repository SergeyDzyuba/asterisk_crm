<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

class Hookjs
{
    /**
     * Include JS
     * @global object $current_user
     */
    public function includeJS()
    {
        global $current_user;

        $GLOBALS['log']->debug('------------  '. __CLASS__ . '::' . __FUNCTION__ . ' BEGIN ------------');

        if (empty($_REQUEST['to_pdf']) && (!empty($_REQUEST['module']) && $_REQUEST['module'] != 'ModuleBuilder') && empty($_REQUEST['to_csv']) && (empty($_REQUEST['action']) || $_REQUEST['action'] != 'modulelistmenu')) {

            if ($_REQUEST['module'] != 'Calendar' && $_GET['action']!='QuickEdit') {
                if ($current_user->asterisk_call_notification) {
                    echo '<input type=hidden id="user_asterisk_extension" value="' . $current_user->asterisk_extension . '"></input>';
                    echo '<script type="text/javascript" src="fancywebsocket.js"></script>';
                    echo '<script type="text/javascript" src="modules/Asterisk/js/get.js"></script>';
                }

                if ($current_user->asterisk_softphone) {
                    //style//
                    echo '<link type="text/css" href="modules/Asterisk/css/normalize.css" rel="stylesheet" media="screen" />';
                    echo '<link type="text/css" href="modules/Asterisk/css/style.css" rel="stylesheet" media="screen" />';
                    echo '<script type="text/javascript" src="modules/Asterisk/js/modernizr.js"></script>';
                    echo '<script type="text/javascript" src="modules/Asterisk/js/jquery.mousewheel.js"></script>';
                    echo '<script type="text/javascript" src="modules/Asterisk/js/jquery.jscrollpane.min.js"></script>';
                    echo '<script type="text/javascript" src="modules/Asterisk/js/main.js"></script>';
                    /////////
                    ///

                    // $test_users = array(
                    //     '2',
                    //     'c52e2eaf-a068-d902-8390-5a65db5f3bfb',
                    //     '5ec3ba68-e650-11e7-9f90-00155d0a0403');

                    // if (
                    //     !in_array($current_user->id, $test_users)
                    // ) {
                    // echo '<script type="text/javascript" src="modules/Asterisk/js/call_new.js"></script>';
                    // echo '<audio id="audio_remote" autoplay="autoplay"></audio>';
                    // echo '<audio id="ringtone" loop src="sounds/ringtone.wav"></audio>';
                    // echo '<audio id="ringbacktone" loop src="sounds/ringbacktone.wav"></audio>';
                    // echo '<script type="text/javascript" src="modules/Asterisk/js/SIPml-api.js"></script>';
                    // echo '<script type="text/javascript" src="modules/Asterisk/js/softphone.js"></script>';
                    // } else {

                    echo '<audio id="ringtone" src="phone/sounds/incoming.mp3" loop></audio>';
                    echo '<audio id="ringbacktone" src="phone/sounds/outgoing.mp3" loop></audio>';
                    echo '<audio id="dtmfTone" src="phone/sounds/dtmf.mp3"></audio>';
                    echo '<audio id="audioRemote"></audio>';

                    echo '<script type="text/javascript" src="phone/scripts/moment.js/moment.min.js"></script>';
                    echo '<script type="text/javascript" src="phone/scripts/SIP.js/sip.min.js"></script>';

                    echo '<script type="text/javascript" src="phone/scripts/app.js"></script>';
                    echo '<script type="text/javascript" src="modules/Asterisk/js/ctxsip.js"></script>';

                    echo '<div hidden id="sip-log" class="panel panel-default hide">
                                        <div class="panel-heading">
                                            <h4 class="text-muted panel-title">Recent Calls <span class="pull-right"><i class="fa fa-trash text-muted sipLogClear" title="Clear Log"></i></span></h4>
                                        </div>
                                        <div id="sip-logitems" class="list-group">
                                            <p class="text-muted text-center">No recent calls from this browser.</p>
                                        </div>
                                    </div>';
                    // }
                }

                if ($current_user->asterisk_dial_buttons) {
                    echo '<script type="text/javascript" src="fancywebsocket.js"></script>';
//                    echo '<script type="text/javascript" src="modules/Asterisk/js/popup.js"></script>'; // Всплывашка
//                    echo '<script type="text/javascript" src="modules/Asterisk/js/call.js"></script>';
                }
            };

            $GLOBALS['log']->debug('includeJS: OK');
        } else {
            $GLOBALS['log']->debug('includeJS: KO');
        }

        $GLOBALS['log']->debug('------------ '. __CLASS__ . '::' . __FUNCTION__ . ' END ------------');
    }
}
