<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

/**
 * SaveCalls class
 */
class SaveCalls
{
    public $_crudModel;
    
    public $_login = 'admin';
    
    public $_password = '9966699';
    
    /**
     * Constructor
     */
    public function __construct()
    {
        require_once 'CRUDModel.php';
        $this->_crudModel = new CRUDModel();
    }
    
    /**
     * Login Soap
     * @param string $host
     * @return string
     */
    public function loginSoap($host) // Функция для фоновой авторизации в SugarCRM.
    {
        if (!defined('sugarEntry')) {
            define('sugarEntry', true);
        }
        
        // Второй вариант:
        $soapClient = new SoapClient(null, array(
            'location' => 'http://' . $host . '/soap.php?wsdl',
            'uri' => 'http://' . $host,
        ));
        
        try {
            $info = $soapClient->login(array(
                'user_name' => $this->_login,
                'password'  => md5($this->_password),
            ), 'SugarTalk Asterisk integration');
        } catch (SoapFault $fault) {
            die('Sorry, the service returned the following ERROR: ' . $fault->faultcode . '-' . $fault->faultstring . '.');
        }
        
        $session_id = $info->id;
        $canlogin = $soapClient->seamless_login($session_id);
        
        if ($canlogin == 1) {
            return $session_id;
        }
    }
    
    /**
     * Save
     * @param string $unique_id
     * @param string $number
     * @param string $operator
     * @param string $callType
     * @param string $audio_file_name
     * @return boolean
     */
    public function save($unique_id, $number, $operator, $callType, $audio_file_name) // Функция сохранения звонка.
    {
        if ($user_id = $this->_getUserId($operator)) { // Получаем ID пользователя, который принадлежит к полученному ранее оператору.
            $data = array(
                'user_id' => $user_id,
                'number' => $number,
                'operator' => $operator,
                'direction' => $callType,
                'unique_id' => $unique_id,
                'audio_file_name' => $audio_file_name,
            ); // Формируем массив с данными, которые необходимо передать в обработчик.
            return $this->_postCURL($data);
        }
        return false;
    }
    
    /**
     * Links
     * @param string $id
     * @return string
     */
    public function links($id)
    {
        $data = array(
            'id' => $id,
        ); // Формируем массив с данными, которые необходимо передать в обработчик.
        
        return $this->_postLinks($data);
    }
    
    /**
     * Post Links
     * @param array $data
     * @return object
     */
    public function _postLinks($data)
    {
        $postString = '';
        foreach ($data as $key => $value) { // Формируем строку параметров для передачи методом CURL.
            $postString .= $key . '=' . $value . '&';
        }

        include __DIR__ . '/../../config_override.php';
        $host = $sugar_config['asterisk_http_host'];
        $url = 'http://' . $host . '/index.php?module=Asterisk&action=GetLinks&to_pdf=true&MSID=' . $this->loginSoap($host);

        $ch = curl_init(); // Инициализируем сессию CURL.
        curl_setopt($ch, CURLOPT_URL, $url); // Указываем URL, куда отправлять POST-запрос.
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // Разрешаем перенаправление.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // Указываем, что результат запроса следует передать в переменную, а не вывести на экран.
        curl_setopt($ch, CURLOPT_TIMEOUT, 1); // Таймаут соединения.
        curl_setopt($ch, CURLOPT_POST, 1); // Указываем, что данные надо передать именно методом POST.
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postString); // Добавляем данные POST-запроса.
        $result = curl_exec($ch); // Выполняем запрос.
        curl_close($ch); // Завершаем сессию.

        return $result;
    }
    
    /**
     * Post CURL
     * @param array $data
     * @return object
     */
    public function _postCURL($data)
    {
        $postString = '';
        
        foreach ($data as $key => $value) { // Формируем строку параметров для передачи методом CURL.
            $postString .= $key . '=' . $value . '&';
        }

        include __DIR__ . '/../../config_override.php';
        $host = $sugar_config['asterisk_http_host'];
        $url = 'http://' . $host . '/index.php?module=Asterisk&action=SaveCalls&to_pdf=true&MSID=' . $this->loginSoap($host);

        $ch = curl_init(); // Инициализируем сессию CURL.
        curl_setopt($ch, CURLOPT_URL, $url); // Указываем URL, куда отправлять POST-запрос.
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // Разрешаем перенаправление.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // Указываем, что результат запроса следует передать в переменную, а не вывести на экран.
        curl_setopt($ch, CURLOPT_TIMEOUT, 1); // Таймаут соединения.
        curl_setopt($ch, CURLOPT_POST, 1); // Указываем, что данные надо передать именно методом POST.
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postString); // Добавляем данные POST-запроса.
        $result = curl_exec($ch); // Выполняем запрос.
        curl_close($ch); // Завершаем сессию.
        
        return $result;
    }
    
    /**
     * Get UserId
     * @param string $asterisk_extension
     * @return boolean
     */
    public function _getUserId($asterisk_extension) // Функция получения ID пользователя, который совершает звонок.
    {
        $select = array('id');

        $where = array(
            'asterisk_extension like "%' . $asterisk_extension . '%"'
        );

        if ($users = $this->_crudModel->read('users', $select, $where)) {
            return $users[0]['id'];
        }
        
        return false;
    }
}
