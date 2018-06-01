<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

class AsteriskHooks
{
    /**
     * 
     * @global object $current_user
     * @param object $bean
     */
    public function relations(&$bean)
    {
        global $current_user;
        
        $phone = '';
        
        foreach ($bean as $key => $value) {
            if (mb_substr($key, 0, 5) == 'phone') {
                if ($key != 'phone_fax' && $value != '') {
                    $phone = $value;
                    break;
                }
            }
        }
        
        $number = str_replace(array(' ', '+', '/', '(', ')', '[', ']', '-',  '.'), '', $phone); // Приведем в порядок наш номер.
        
        $cookieCallId = 'asterisk_' . $current_user->asterisk_extension . '_' . $number;
        $call_id = isset($_COOKIE[$cookieCallId]) ? $_COOKIE[$cookieCallId] : '';
        
        if (!empty($call_id)) {
            $call = new Call();
            $call->retrieve($call_id);
            $module = strtolower($bean->module_name);
            $call->load_relationship($module);
            $call->$module->add($bean->id);
            
            setcookie($cookieCallId, '', time() - 3600);
        }
    }
}
