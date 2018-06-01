<?php

/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

use PAMI\Listener\IEventListener;
use PAMI\Message\Event\EventMessage;

class PAMIListener implements IEventListener
{

    /**
     * Статусы:
     *
     * 0 - входящий вызов
     * 1 - вызов принят
     * 2 - разговор окончен
     * 3 - вызов пропущен
     * 4 - вызов отклонен
     * 5 - исходящий вызов
     * 6 - вызов из SugarCRM
     * 7 - ни один оператор не принял вызов
     */
    // ВНИМАНИЕ!!! В config_override.php необходимо занести следующую строчку:

    public $_crudModel;
    public $_saveCalls;
    public $_tableAsteriskCel = 'asterisk_cel';
    public $_tableAsteriskCalls = 'asterisk_calls';
    public $_newStateName = 0;
    public $_operatorLength = 3; // Длина номера оператора

    /**
     * Constructor
     */

    public function __construct()
    {
        require_once 'CRUDModel.php';
        require_once 'SaveCallsCEL.php';

        $this->_crudModel = new CRUDModel();
        $this->_saveCalls = new SaveCalls();
    }

    /**
     * Handle
     * @param EventMessage $event
     */
    public function handle(EventMessage $event)
    {
        if ($event instanceof \PAMI\Message\Event\CELEvent) {
            $this->CELEvent($event); // Ловим событие CEL.
        }
    }

    /**
     * CEL Event
     * @param object $event
     * @return string
     */
    private function CELEvent($event) // Ловим событие CEL.
    {
        if (!isset($db)) {
            $db = $this->_crudModel->_DBConnect();
        } // Подключаемся к БД.

        $data = array(
            'appdata' => $event->getAppData(),
            'calleridnum' => $event->getCallerIDnum(),
            'eventname' => $event->getEventName(),
            'eventtime' => $event->getEventTime(),
            'exten' => $event->getExten(),
            'linked_id' => $event->getLinkedID(),
            'unique_id' => $event->getUniqueID(),
        );

        $insert_id = $this->_crudModel->create($this->_tableAsteriskCel, $data); // Добавляем данные по вызову из SugarCRM в БД.

        $number = $event->getcallerIDnum();
        $eventname = $event->getEventName();
        $time = $event->getEventTime();
        $linked_id = $event->getLinkedID();
        $unique_id = $event->getUniqueID();
        $this->_getCallerNum($linked_id);

        //// Всплывашка
        // 1. Ring
        if ($eventname == 'CHAN_START' && strlen($number) == $this->_operatorLength) {
            $a_data = array(
                'status' => 0,
                'event' => 'Ring',
                'operator' => $number,
                'number_from' => $this->_getCallerNum($linked_id),
                'number_to' => $number,
                'unique_id' => $unique_id,
                'linked_id' => $linked_id,
                'links' => $this->_getLinks($number),
                'date' => $time,
                'actual' => '1',
            );

            if (!$this->_isOutbound($linked_id)) {
                $this->_crudModel->create($this->_tableAsteriskCalls, $a_data);
            }
        }

        // 2. Bridge(Link)
        if ($eventname == 'ANSWER' && strlen($number) == $this->_operatorLength) {
            $a_data = array(
                'status' => 1,
                'event' => 'Link',
                'date' => $time,
                'links' => $this->_getLinks($number),
                'actual' => '1',
            );
            $where = array(
                'unique_id = "' . $unique_id . '"',
            );
            $this->_crudModel->update($this->_tableAsteriskCalls, $a_data, $where);
        }

        // 3. Hangup
        if ($eventname == 'HANGUP' && strlen($number) == $this->_operatorLength) {
            $a_data = array(
                'status' => 2,
                'date' => $time,
                'links' => $this->_getLinks($number),
                'actual' => '1',
            );

            if ($this->_hasAnswer($unique_id)) {/// проверку на пропущенный (если есть answer для этого же uid)
                $a_data['event'] = 'End';
            } else {
                $a_data['event'] = 'Miss';
                $a_data['status'] = 3;
            }

            $where = array(
                'unique_id = "' . $unique_id . '"',
            );
            $this->_crudModel->update($this->_tableAsteriskCalls, $a_data, $where);

            // Сохранение входящего
            if (!$this->_isOutbound($linked_id)) {
                $this->_saveCalls->save(
                        $linked_id, // unique_id
                        $this->_getCallerNum($linked_id), // number_from
                        null, // ???
                        $number, // operator
                        'Inbound', // direction
                        $linked_id, // unique_id
                        null    // ???
                );
            } else {
                echo "trying to save outbound call _getCallerNumOutbound = " . $this->_getCallerNumOutbound($linked_id) . " linked_id = " . $linked_id . " operator = " . $this->_getOperator($linked_id);
                $this->_saveCalls->save(
                        $linked_id, // unique_id
                        $this->_getCallerNumOutbound($linked_id), // number_from
                        null, // ???
                        $this->_getOperator($linked_id), // operator
                        'Outbound', // direction
                        $linked_id, // unique_id
                        null    // ???
                );
            }
        }

        mysql_close($db); // Закрываем соединение с БД.

        return $insert_id;
    }

    /**
     * Has Answer
     * @param string $unique_id
     * @return string
     */
    public function _hasAnswer($unique_id) // Проверяем есть ли answer по данному unique_id
    {
        $select = array('id');

        $where = array(
            'eventname = "ANSWER"',
            'unique_id = "' . $unique_id . '"'
        );

        if ($events = $this->_crudModel->read($this->_tableAsteriskCel, $select, $where)) {
            return $events[0]['id'];
        }
    }

    /**
     * Get CallerNum
     * @param string $linked_id
     * @return string
     */
    public function _getCallerNum($linked_id) // Получаем номер звонящего по linked_id
    {
        $select = array('calleridnum');

        $where = array(
            'eventname = "CHAN_START"',
            'char_length(calleridnum) > 6',
            'linked_id = "' . $linked_id . '"'
        );

        if ($events = $this->_crudModel->read($this->_tableAsteriskCel, $select, $where)) {
            return substr($events[0]['calleridnum'], -11);
        }
    }

    /**
     * Get CallerNumOutbound
     * @param string $linked_id
     * @return string
     */
    public function _getCallerNumOutbound($linked_id) // Получаем номер звонящего по linked_id
    {
        $select = array('calleridnum');

        $where = array(
            ' (eventname = "ANSWER" or eventname = "HANGUP") ',
            'char_length(calleridnum) > 6',
            'linked_id = "' . $linked_id . '"'
        );

        if ($events = $this->_crudModel->read($this->_tableAsteriskCel, $select, $where)) {
            return substr($events[0]['calleridnum'], -11);
        }
    }

    /**
     * Get Links
     * @param string $id
     * @return string
     */
    public function _getLinks($id)
    {
        return $this->_saveCalls->links($id);
    }

    /**
     * Is Outbound
     * @param string $linked_id
     * @return boolean
     */
    public function _isOutbound($linked_id)
    {
        $select = array('calleridnum');

        $where = array(
            'eventname = "CHAN_START"',
            'linked_id = "' . $linked_id . '"'
        );

        if ($events = $this->_crudModel->read($this->_tableAsteriskCel, $select, $where)) {
            if (strlen($events[0]['calleridnum']) < 5) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get Operator
     * @param string $linked_id
     * @return string
     */
    public function _getOperator($linked_id) // Получаем номер оператора
    {
        $select = array('calleridnum');

        $where = array(
            'eventname = "ANSWER"',
            'char_length(calleridnum) < 6',
            'linked_id = "' . $linked_id . '"'
        );

        if ($events = $this->_crudModel->read($this->_tableAsteriskCel, $select, $where)) {
            return $events[0]['calleridnum'];
        }
    }

}
