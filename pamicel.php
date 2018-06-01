<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

require_once 'config_override.php';

$argv = array(
    'foo' => '',
    'host' => $sugar_config['asterisk_host'],
    'port' => $sugar_config['asterisk_port'],
    'user' => $sugar_config['asterisk_user'],
    'pass' => $sugar_config['asterisk_pass'],
    'connect_timeout' => 60,
    'read_timeout' => 60,
);

$argv = array_values($argv);

require_once 'PAMI/Log4PHP/Logger.php';

// Setup include path.
ini_set(
    'include_path',
    implode(
        PATH_SEPARATOR,
        array(
            implode(DIRECTORY_SEPARATOR, array('..', '..', '..', 'src', 'mg')),
            ini_get('include_path'),
        )
    )
);

////////////////////////////////////////////////////////////////////////////////
// Mandatory stuff to bootstrap.
////////////////////////////////////////////////////////////////////////////////
require_once 'PAMI/Autoloader/Autoloader.php'; // Include PAMI autoloader.
\PAMI\Autoloader\Autoloader::register(); // Call autoloader register for PAMI autoloader.
use PAMI\Client\Impl\ClientImpl;
use PAMI\Listener\IEventListener;
use PAMI\Message\Event\EventMessage;

require_once 'service/asterisk/PAMIListenerCEL.php';

////////////////////////////////////////////////////////////////////////////////
// Code STARTS.
////////////////////////////////////////////////////////////////////////////////
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $options = array(
        'log4php.properties' => realpath(__DIR__) . DIRECTORY_SEPARATOR . 'PAMI/log4php.properties',
        'host' => $argv[1],
        'port' => $argv[2],
        'username' => $argv[3],
        'secret' => $argv[4],
        'connect_timeout' => $argv[5],
        'read_timeout' => $argv[6],
        'scheme' => 'tcp://' // try tls://
    );
    $a = new ClientImpl($options);

    // Register an IEventListener:
    $a->registerEventListener(new PAMIListener());
    $a->open();
    
    // SMS
    $time = time();
    while (true) {// Wait for events.
        usleep(1000); // 1ms delay
        // Since we declare(ticks=1) at the top, the following line is not necessary
        $a->process();
    }
    $a->close(); // send logoff and close the connection.
} catch (Exception $e) {
    echo $e->getMessage() . "\n";
}
////////////////////////////////////////////////////////////////////////////////
// Code ENDS.
////////////////////////////////////////////////////////////////////////////////
