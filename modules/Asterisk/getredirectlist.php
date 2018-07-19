<?php

///////////////////////////////////////////////////////////////////////////////////////
// * * * * * * * * * * * * * * * A S T E R I S K * * * * * * * * * * * * * * * * * * //
///////////////////////////////////////////////////////////////////////////////////////

include('config.php');

//die("trying to connect on " . $sugar_config['asterisk_host'] . ":" . intval($sugar_config['asterisk_port']));

// Получаем операторов в сети
$socket = fsockopen($sugar_config['asterisk_host'], intval($sugar_config['asterisk_port']), $errno, $errstr, 20); // Открываем сокет.
if (!$socket) exit("Error $errno : $errstr");

// AMI login
fputs($socket, "Action: Login\r\n");
fputs($socket, "Username: " . $sugar_config['asterisk_user'] . "\r\n");
fputs($socket, "Secret: " . $sugar_config['asterisk_pass'] . "\r\n");
fputs($socket, "events:off");
fputs($socket, "\r\n\r\n");

// AMI action
fputs($socket, "Action: command\r\n");
fputs($socket, "Command: sip show peers\r\n");
fputs($socket, "\r\n\r\n");

$i = 1000;
$reading = false;
$ops = array();
$msg = fgets($socket);
$count = 0;
while ($i < 900)
{
	if ($reading == false && strpos($msg, 'Name/username') !== false) // Устанавливаем режим чтения очереди
	{
		$reading = true;
	};
	if ($reading == true && strpos($msg, 'sip peers [Monitored:') !== false) // Выключаем режим чтения
	{
		$reading = false;
		$i = 1000;
	};
	if ($reading == true) // Обработка полученных строк
	{
		if (preg_match('/^(\\d{4})\\s+.+\\((\\d+ ms)|^(\\d{4})\\/\\d{4}\\s+.+\\((\\d+ ms)/', $msg, $matches)){
			if ($matches[3] > 3000) {
				$ops[] = $matches[3];
			}
		}
		$i += 1;
	};
	// Обновляем сообщение
	$msg = fgets($socket);
}

///////////////////////////////////////////////////////////////////////////////////////
// * * * * * * * * * * * * * * * A S T E R I S K * * * * * * * * * * * * * * * * * * //
///////////////////////////////////////////////////////////////////////////////////////

global $db;

$res = $db->query('select first_name, last_name, asterisk_extension, phone_mobile from users where deleted = 0 and asterisk_extension > 99 order by last_name asc');
while($row = $db->fetchByAssoc($res))
{
	$mobile = explode("^|^", $row['phone_mobile']);
	$mobile = $mobile[0];
	$mobile = preg_replace("/[^0-9,.]/", "", $mobile);

	if (in_array($row['asterisk_extension'], $ops)){
		$live .= '<li class="phone-list-item">
					<div class="phone-list-item-name">' . $row['last_name'] . " " . $row['first_name'] . '</div>
					<div class="phone-list-item-code">
					<a href="#">' . $row['asterisk_extension'] . '</a>
					</div>
					<div class="phone-list-item-number">
						<a href="#">' . $mobile . '</a>
					</div>
				</li>';
	} else {
		/*$dead .= $row['last_name'] . " " . $row['first_name'] . ' 
	 <a href="#" onclick="redirect(' . $row['phone_mobile'] . ')">' . $row['phone_mobile'] . '</a><br>';*/
	 	$dead .= '<li class="phone-list-item">
					<div class="phone-list-item-name">' . $row['last_name'] . " " . $row['first_name'] . '</div>
					<div class="phone-list-item-code">
					<a href="#">' . $row['asterisk_extension'] . '</a>
					</div>
					<div class="phone-list-item-number">
						<a href="#">' . $mobile . '</a>
					</div>
				</li>';
	}
}
$list = '<div class="phone-book">
			<div class="status">В сети</div>
			<ul class="phone-list">';
$list .= $live;
$list .= '</ul>
			</div>
			<div class="phone-book">
				<div class="status">Офлайн</div>
				<ul class="phone-list">';
$list .= $dead;
$list .= '</ul></div>';
echo $list;