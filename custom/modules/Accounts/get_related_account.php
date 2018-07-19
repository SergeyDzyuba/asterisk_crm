<?php

	$id = $_POST['id'];
	global $db;

	$result = $db->query("SELECT a.id, a.name FROM accounts_contacts ac LEFT JOIN accounts a ON a.id = ac.account_id WHERE ac.contact_id = '{$id}' AND ac.deleted = 0");

	$arr = $db->fetchRow($result);

	header('Content-Type: application/json');
	echo json_encode($arr);