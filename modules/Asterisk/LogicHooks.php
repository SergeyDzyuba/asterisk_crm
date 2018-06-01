<?php

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

class after_relationship_add_class
{

    /**
     * 
     * @global object $db
     * @param object $bean
     * @param array $event
     * @param array $arguments
     */
    public function contact_lead_to_call($bean, $event, $arguments)
    {
        global $db;

        //contacts phone mobile
        //accounts phone office
        //leads phone mobile

        if ($bean->module_name == "Contacts") {
            if (isset($bean->phone_mobile) && strlen($bean->phone_mobile) > 9) {
                $query = "UPDATE calls SET parent_type = 'Contacts', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_mobile, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
            if (isset($bean->phone_home) && strlen($bean->phone_home) > 9) {
                $query = "UPDATE calls SET parent_type = 'Contacts', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_home, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
            if (isset($bean->phone_work) && strlen($bean->phone_work) > 9) {
                $query = "UPDATE calls SET parent_type = 'Contacts', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_work, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
        }

        if ($bean->module_name == "Leads") {
            if (isset($bean->phone_mobile) && strlen($bean->phone_mobile) > 9) {
                $query = "UPDATE calls SET parent_type = 'Leads', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_mobile, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
            if (isset($bean->phone_home) && strlen($bean->phone_home) > 9) {
                $query = "UPDATE calls SET parent_type = 'Leads', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_home, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
            if (isset($bean->phone_work) && strlen($bean->phone_work) > 9) {
                $query = "UPDATE calls SET parent_type = 'Leads', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_work, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
        }

        if ($bean->module_name == "Accounts") {
            if (isset($bean->phone_office) && strlen($bean->phone_office) > 9) {
                $query = "UPDATE calls SET parent_type = 'Accounts', parent_id = '" . $bean->id . "' WHERE phone LIKE '%" . substr($bean->phone_office, -10) . "' AND phone IS NOT NULL AND phone != ''";
                $db->query($query);
            }
        }
    }

}
