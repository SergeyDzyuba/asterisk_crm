<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

require_once 'service/core/SoapHelperWebService.php';

class extraRestUtils extends SoapHelperWebServices
{

    public $name_pattern_inbound = 'CALL_NAME_PATTERN_INBOUND';
    public $description_pattern_inbound = 'CALL_DESCRIPTION_PATTERN_INBOUND';
    public $name_pattern_outbound = 'CALL_NAME_PATTERN_OUTBOUND';
    public $description_pattern_outbound = 'CALL_DESCRIPTION_PATTERN_OUTBOUND';

    /**
     * Call Log
     * @global object $beanList
     * @global object $timedate
     * @param object $seed
     * @param string $time_duration
     */
    public function callLog($seed, $time_duration = null)
    {
        global $beanList;
        global $timedate;

        $time_duration = intval($time_duration);

        $time_now = $timedate->nowDb();

        $callBean = new Call();
        $callBean->assigned_user_id = $seed->assigned_user_id;

        if ($seed->destination == "in") {
            $callBean->direction = "Inbound";
            $callBean->name = self::createStringFromPattern($seed, $this->name_pattern_inbound); //use pattern CALL_NAME_PATTERN_INBOUND for generate name
            $callBean->description = self::createStringFromPattern($seed, $this->description_pattern_inbound); //use pattern CALL_DESCRIPTION_PATTERN_INBOUND for generate description
        } else {
            $callBean->direction = "Outbound";
            $callBean->name = self::createStringFromPattern($seed, $this->name_pattern_outbound); //use pattern CALL_NAME_PATTERN_OUTBOUND for generate name
            $callBean->description = self::createStringFromPattern($seed, $this->description_pattern_outbound); //use pattern CALL_DESCRIPTION_PATTERN_OUTBOUND for generate description
        }

        $module_name = $seed->parent_type;

        if ($module_name == 'Employees') {
            $module_name = 'Users';
        }

        $focus = new $beanList[$module_name];
        $focus->retrieve($seed->parent_id);

        if (!empty($focus->account_id)) {
            $callBean->parent_type = 'Accounts';
            $callBean->parent_id = $focus->account_id;
        } else {
            $callBean->parent_type = $seed->parent_type;
            $callBean->parent_id = $seed->parent_id;
        }

        $callBean->status = 'Held';
        $callBean->reminder_time = -1;

        $callBean->duration_hours = floor($time_duration / (60 * 60));
        $divisor_for_minutes = $time_duration % (60 * 60);
        $callBean->duration_minutes = floor($divisor_for_minutes / 60);

        $callBean->date_start = date($timedate->get_db_date_time_format(), strtotime($time_now . "{$callBean->duration_hours} hours ago {$callBean->duration_minutes} mins ago"));

        $callBean->save();

        $rel_field_name = $focus->table_name;

        if ($callBean->load_relationship($rel_field_name)) {
            $callBean->$rel_field_name->add($focus->id);
        }

        if ($callBean->load_relationship('users')) {
            $callBean->users->add($seed->assigned_user_id);
        }
    }

    /**
     * Get User ByCID
     * @global object $db
     * @param string$cid
     * @return string
     */
    public function getUserByCID($cid)
    {
        global $db;

        $phone_fields = array();

        foreach (array('phone_home', 'phone_mobile', 'phone_work', 'phone_other', 'phone_fax') as $field) {
            $phone_fields[] = self::getSqlReplaceSymbols('users.' . $field, $cid);
        }

        $where = '';

        if (!empty($phone_fields)) {
            $where = join(' OR ', $phone_fields);
        }

        $query = "SELECT id
				  FROM users
				  WHERE users.deleted = 0 AND ({$where} OR users.asterisk_extension = '$cid')
				  LIMIT 1";

        $result = $db->query($query);
        $row = $db->fetchByAssoc($result);

        return $row['id'];
    }

    /**
     * Get ParentByCID
     * @param string $cid
     * @return array
     */
    public function getParentByCID($cid)
    {
        foreach (array('Contacts', 'Leads', 'Accounts') as $module_name) {
            $find_id = $this->searchPhoneInModule($module_name, $cid);
            if (!empty($find_id)) {
                // D1ma Z.
                $result[$module_name] = array('parent_type' => $module_name, 'parent_id' => $find_id);
            }
        }

        if (!empty($result)) {
            return $result;
        } // D1ma Z.
        // try find this id in User module
        $find_id = $this->getUserByCID($cid);
        if (!empty($find_id)) {
            return array('parent_type' => 'Employees', 'parent_id' => $find_id);
        }

        return array(); // D1ma Z.
    }

    /**
     * Search Phone InModule
     * @global object $beanList
     * @param string $module_name
     * @param string $number_phone
     * @return boolean
     */
    public function searchPhoneInModule($module_name, $number_phone)
    {
        global $beanList;

        $focus = new $beanList[$module_name];

        $fields = $focus->getFieldDefinitions();
        $phone_fields = array();

        foreach ($fields as $def) {
            if (isset($def['type']) and $def['type'] == 'phone' and ( !isset($def['source']) or $def['source'] != 'non-db')) {
                $phone_fields[] = self::getSqlReplaceSymbols($focus->table_name . '.' . $def['name'], $number_phone);
            }
        }

        if (empty($phone_fields)) {
            return false;
        }

        $where = join(' OR ', $phone_fields);

        $list = $focus->get_list($order_by = "", $where, $row_offset = 0, $limit = 1);

        if (!empty($list['list'])) {
            return $list['list'][0]->id;
        } else {
            return false;
        }
    }

    /**
     * create String FromPattern
     * @global array $current_language
     * @param object $focus
     * @param array $name_pattern
     * @param string $pattern
     * @return string
     */
    public static function createStringFromPattern($focus, $name_pattern = null, $pattern = null)
    {
        global $current_language;

        if ($name_pattern !== null and $pattern === null) {
            $current_module_strings = return_module_language($current_language, $focus->module_dir);

            $pattern = $current_module_strings[$name_pattern];
        }

        preg_match_all("#{(\S*?)}#", $pattern, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $var_pattern = $match[1];
            if (isset($focus->$var_pattern)) {
                $pattern = str_replace($match[0], $focus->$var_pattern, $pattern);
            } else {
                $pattern = str_replace($match[0], '', $pattern);
            }
        }

        return $pattern;
    }

    /**
     * Get SqlReplace Symbols
     * @param string $column_name
     * @param string $number_phone
     * @return string
     */
    protected static function getSqlReplaceSymbols($column_name, $number_phone)
    {
        $number_phone = substr($number_phone, -10);
        $sqlReplace = "
			    replace(  replace(  replace(  replace(  replace(  replace(  replace(  replace(
			    $column_name,
			    ' ', ''), '+', ''), '/', ''), '(', ''), ')', ''), '[', ''), ']', ''), '-', '')
				REGEXP '$number_phone$' = 1
			";
        return $sqlReplace;
    }

    /**
     * Get Field Defs
     * @global array $app_list_strings
     * @param object $focus
     * @return array
     */
    public static function getFieldDefs($focus)
    {
        $fieldDefs = array();

        if ($focus) {
            global $app_list_strings;

            if (!empty($focus->assigned_user_id)) {
                $focus->assigned_user_name = get_assigned_user_name($focus->assigned_user_id);
            }

            foreach ($focus->toArray() as $name => $value) {
                $valueFormatted = false;

                if (!empty($fieldDefs[$name]) && !empty($fieldDefs[$name]['value'])) {
                    $fieldDefs[$name] = array_merge($focus->field_defs[$name], $fieldDefs[$name]);
                } else {
                    $fieldDefs[$name] = $focus->field_defs[$name];
                }


                foreach (array("formula", "default", "comments", "help") as $toEscape) {
                    if (!empty($fieldDefs[$name][$toEscape])) {
                        $fieldDefs[$name][$toEscape] = htmlentities($fieldDefs[$name][$toEscape], ENT_QUOTES, 'UTF-8');
                    }
                }

                if (isset($fieldDefs[$name]['options']) && isset($app_list_strings[$fieldDefs[$name]['options']])) {
                    $fieldDefs[$name]['options'] = $app_list_strings[$fieldDefs[$name]['options']];
                }

                if (!$valueFormatted) {
                    $value = isset($focus->$name) ? $focus->$name : '';
                }

                if (empty($fieldDefs[$name]['value'])) {
                    $fieldDefs[$name]['value'] = $value;
                }
            }
        }

        if (isset($focus->additional_meta_fields)) {
            $fieldDefs = array_merge($fieldDefs, $focus->additional_meta_fields);
        }

        return $fieldDefs;
    }

}
