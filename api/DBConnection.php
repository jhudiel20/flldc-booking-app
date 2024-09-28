<?php
// Define constants for database connection
if(!defined('host')) define('host', $_ENV['POSTGRES_HOST']);
if(!defined('username')) define('username', $_ENV['POSTGRES_USER']);
if(!defined('password')) define('password', $_ENV['POSTGRES_PASSWORD']);
if(!defined('db_tbl')) define('db_tbl', $_ENV['POSTGRES_DATABASE']);
if(!defined('port')) define('port', 5432);

Class DBConnection{
    public $conn;
    function __construct(){
        try {
            $this->conn = new PDO("pgsql:host=".host.";port=".port.";dbname=".db_tbl.";sslmode=require", username, password);
            // Set error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database Connection Error: " . $e->getMessage());
        }
    }
    function __destruct(){
         $this->conn = null; // Close the connection
    }

}
$db = new DBConnection();
$conn = $db->conn;
