<?php

// Do not store anything in this file that is not part of the array or the hook version.  This file will
// be automatically rebuilt in the future.
$hook_version = 1;
$hook_array = array();
// position, file, function
$hook_array['after_ui_frame'] = array();
$hook_array['after_ui_frame'][] = array(10000, 'Add Button for load form with reports settings', 'modules/OfficeReportsMerge/ReportHook.php', 'ReportHook', 'addButton');
$hook_array['after_ui_frame'][] = array(13123123, 'add geocomplete lib', 'custom/modules/addGeoLib.php', 'addGeoLib', 'add');
$hook_array['after_ui_frame'][] = array(1, 'Add new button to listview', 'custom/modules/XlsExport/UpdateListView.php', 'UpdateListView', 'addCustomButton');
$hook_array['after_ui_frame'][] = array(2, 'Add kXML button to listview', 'modules/kXML/add_action.php', 'kXMLAction', 'addCustomButtonAction');
$hook_array['after_ui_frame'][] = array(2, 'Добавить форму сохранения файла для XLS', 'custom/modules/Realty/xls/add_xls_window_save.php', 'xlsAction', 'addWindow');
$hook_array['after_ui_footer'] = array();
$hook_array['after_retrieve'] = array();
$hook_array['after_retrieve'][] = array(1, 'acl_fields', 'modules/acl_fields/fields_logic.php', 'acl_fields_logic', 'limit_views');
$hook_array['process_record'] = array();
$hook_array['process_record'][] = array(1, 'acl_fields', 'modules/acl_fields/fields_logic.php', 'acl_fields_logic', 'limit_listviews');
$hook_array['after_ui_frame'][] = array(666, 'add message script', 'custom/include/TabsFlags.php', 'MessageHook', 'addScript');
$hook_array['after_ui_frame'][] = array(10, 'includeJS', 'modules/Asterisk/ext/HookJs.php', 'Hookjs', 'includeJS');
