<?php

$query = 'SELECT * FROM users WHERE deleted = 0 AND id = (select assigned_user_id from contacts where deleted = 0 and phone_mobile like "%' . $_GET['phone'] . '" or phone_home like "%' . $_GET['phone'] . '" or phone_work like "%' . $_GET['phone'] . '" or phone_fax like "%' . $_GET['phone'] . '" limit 1) limit 1';
require_once "config.php";
$username = $sugar_config['dbconfig']['db_user_name'];
$password = $sugar_config['dbconfig']['db_password'];
$hostname = $sugar_config['dbconfig']['db_host_name'];
$dbname = $sugar_config['dbconfig']['db_name'];
//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password)
        or die("Unable to connect to MySQL");
$selected = mysql_select_db($dbname, $dbhandle)
        or die("Could not select db");
$result = mysql_query($query);
$row = mysql_fetch_array($result);
echo $row['asterisk_extension'];
