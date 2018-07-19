<?php
global $db;

if(isset($_REQUEST['id'])){
	$id = $_REQUEST['id'];
	//opportunities
	$query = "SELECT name, id, date_entered FROM opportunities WHERE contact_id = '{$id}' AND deleted = 0 ORDER BY date_entered DESC LIMIT 5";
	$res = $db->query($query);
	if ($row = $db->fetchByAssoc($res)) $result .= "<a href='index.php?module=Opportunities&action=DetailView&record=" . $row['id'] . "'>" . $row['name'] . "</a>";
	while($row = $db->fetchByAssoc($res)){
		$result .= "<br><a href='index.php?module=Opportunities&action=DetailView&record=" . $row['id'] . "'>" . $row['name'] . "</a>";
	};

	//split
	$result .= "^|^";

	//cases
	$query = "SELECT name, id, date_entered FROM cases WHERE deleted = 0 AND id IN (SELECT case_id FROM contacts_cases WHERE contact_id = '{$id}') ORDER BY date_entered DESC LIMIT 5";
	$res = $db->query($query);
	if ($row = $db->fetchByAssoc($res)) $result .= "<a href='index.php?module=Cases&action=DetailView&record=" . $row['id'] . "'>" . $row['name'] . "</a>";
	while($row = $db->fetchByAssoc($res)){
		$result .= "<br><a href='index.php?module=Cases&action=DetailView&record=" . $row['id'] . "'>" . $row['name'] . "</a>";
	};

	//result
	echo $result;
}
