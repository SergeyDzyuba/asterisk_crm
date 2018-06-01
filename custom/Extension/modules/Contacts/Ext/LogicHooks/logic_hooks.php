<?php

$hook_array['after_relationship_add'][] = array(
    1,
    'utm метки',
    'modules/Asterisk/LogicHooks.php',
    'after_relationship_add_class',
    'add_utm_contacts'
);
$hook_array['after_save'][] = array(
    1,
    'utm метки',
    'modules/Asterisk/LogicHooks.php',
    'after_relationship_add_class',
    'link_call_contacts'
);
