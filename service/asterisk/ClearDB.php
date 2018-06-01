<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

require_once '../../config.php';

$db = mysql_connect('localhost', $sugar_config['dbconfig']['db_user_name'], $sugar_config['dbconfig']['db_password']);

if (!$db) {
    die('Ошибка соединения: ' . mysql_error());
}

mysql_select_db($sugar_config['dbconfig']['db_name'], $db);
mysql_query("SET NAMES 'utf8'", $db);

/**
 * Delete Events
 * @param string $days
 * @return array
 */
function deleteEvents($days)
{
    $query = "DELETE
		FROM asterisk
		WHERE `date` < (NOW() - INTERVAL " . $days . " DAY)";

    if (mysql_query($query)) {
        return mysql_affected_rows();
    }
}

deleteEvents(1);
