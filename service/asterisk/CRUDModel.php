<?php
/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */
 
/**
 * CRUDModel class
 */
class CRUDModel
{
    /**
     * DBConnect
     * @return boolean
     */
    public function _DBConnect()
    {
        include __DIR__ . '/../../config.php';
        
        $db = mysql_connect('localhost', $sugar_config['dbconfig']['db_user_name'], $sugar_config['dbconfig']['db_password']);
        
        if ($db) {
            mysql_select_db($sugar_config['dbconfig']['db_name'], $db);
            mysql_query("SET NAMES 'utf8'", $db);
            
            return $db;
        }
        
        return false;
    }

    /**
     * Get mssql_insert_id
     * @return object
     */
    public function mssql_insert_id()
    {
        $result = @mssql_query("SELECT @@identity");
        
        if (!$result) {
            return -1;
        }
        
        return mssql_result($result, 0, 0);
    }
    
    /**
     * 
     * @param type $table
     * @param type $data
     * @return boolean
     */
    public function create($table = '', $data = array())
    {
        $query = "INSERT INTO $table
			(" . implode(", ", array_keys($data)) . ")
			VALUES ('" . implode("', '", array_values($data)) . "')";
        
        if (mysql_query($query)) {
            return mysql_insert_id();
        }
        
        return false;
    }
    
    /**
     * Read
     * @param string $table
     * @param string $select
     * @param string $where
     * @return array
     */
    public function read($table = '', $select = array(), $where = array())
    {
        $query = "SELECT " . implode(", ", $select) . "
			FROM $table
			WHERE " . implode(" AND ", $where);
        
        $result = mysql_query($query);
        $rows = array();
        
        while ($row = mysql_fetch_assoc($result)) {
            $rows[] = $row;
        }
        
        mysql_free_result($result);
        
        return $rows;
    }
    
    /**
     * Update
     * @param string $table
     * @param string $updated
     * @param string $where
     * @return boolean
     */
    public function update($table = '', $updated = array(), $where = array())
    {
        foreach ($updated as $key => $value) {
            $set[] = $key . ' = \'' . $value . '\'';
        }
        
        $query = "UPDATE $table
			SET " . implode(", ", $set) . "
			WHERE " . implode(" AND ", $where);
        
        if (mysql_query($query)) {
            return mysql_affected_rows();
        }
        
        return false;
    }
    
    /**
     * Delete
     * @param string $table
     * @param string $where
     * @return boolean
     */
    public function delete($table = '', $where = array())
    {
        $query = "DELETE
			FROM $table
			WHERE " . implode(" AND ", $where);
        
        if (mysql_query($query)) {
            return mysql_affected_rows();
        }
        
        return false;
    }
}
