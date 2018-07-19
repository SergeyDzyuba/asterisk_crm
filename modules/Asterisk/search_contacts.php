<?php
$number = isset($_REQUEST['number']) ? $_REQUEST['number']	:null;
$number = substr($number, -10);


if ($number != null && strlen($number) > 9){
	global $db;
	$used_and = false;
	$select = "select contacts.id, first_name, last_name, phone_mobile from contacts ";
	$where = "";
	if ($number != null) $where .= " and phone_mobile like '%{$number}%'";
	$query = $select . " WHERE contacts.deleted = 0 " . $where . " LIMIT 1";
	if (isset($_REQUEST['debug'])) 
		echo $query;
	$res = $db->query($query);
	if ($row = $db->fetchByAssoc($res)){
		//echo "<a href='#' onclick='select_contact(\"" . $row['id'] . "\", \"" . $row['first_name'] . "\", \"" . $row['phone_mobile'] . "\")'>" . $row['first_name'] . " " . $row['last_name'] . /*" (" . $row['phone_mobile'] . ")" .*/ "<br>";
		echo "contacts^" . $row['id'] . "^" . $row['first_name'] . "^" . $row['last_name'];
	} else {
		$used_and = false;
		$select = "select accounts.id, name, phone_office from accounts ";
		$where = "";
		if ($number != null) $where .= " and phone_office like '%{$number}%'";
		$query = $select . " WHERE accounts.deleted = 0 " . $where . " LIMIT 1";
		if (isset($_REQUEST['debug'])) 
			echo $query;
		$res = $db->query($query);
		if ($row = $db->fetchByAssoc($res)){
			//echo "<a href='#' onclick='select_contact(\"" . $row['id'] . "\", \"" . $row['first_name'] . "\", \"" . $row['phone_mobile'] . "\")'>" . $row['first_name'] . " " . $row['last_name'] . /*" (" . $row['phone_mobile'] . ")" .*/ "<br>";
			echo "accounts^" . $row['id'] . "^" . $row['name'] . "^";
		}
	};
} else {
	echo "-1";
}