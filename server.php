<?php
// prevent the server from timing out
set_time_limit(0);

// include the web sockets server script (the server is started at the far bottom of this file)
require 'class.PHPWebSocket.php';

/**
 * When a client sends data to the server
 * @global PHPWebSocket $Server
 * @param string $clientID
 * @param string $message
 * @param string $messageLength
 * @return
 */
function wsOnMessage($clientID, $message, $messageLength)
{
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);

    // check if message length is 0
    if ($messageLength == 0) {
        $Server->wsClose($clientID);
        return;
    }
    //write clients asterisk_extension to array
    foreach ($Server->wsClients as $id => $client) {
        if ($id == $clientID) {
            $client[] = $message;
            $Server->clientsEx[$clientID] = $message;
        }
    }
}

/**
 * When a client connects
 * @global PHPWebSocket $Server
 * @param string $clientID
 */
function wsOnOpen($clientID)
{
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);

    $Server->log("$ip ($clientID) has connected.");
}

/**
 * When a client closes or lost connection
 * @global PHPWebSocket $Server
 * @param string $clientID
 * @param string $status
 */
function wsOnClose($clientID, $status)
{
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);

    $Server->log("$ip ($clientID) has disconnected. Status = " . $status);
}

// start the server
$Server = new PHPWebSocket();
$Server->bind('message', 'wsOnMessage');
$Server->bind('open', 'wsOnOpen');
$Server->bind('close', 'wsOnClose');
// for other computers to connect, you will probably need to change this to your LAN IP or external IP,
// alternatively use: gethostbyaddr(gethostbyname($_SERVER['SERVER_NAME']))
$Server->wsStartServer('0.0.0.0', 12345);
