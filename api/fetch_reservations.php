<?php
// Include your database connection file
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

// Get room, time, and reserve_date from the request (via GET or POST)
$room = $_POST['room'] ?? '';
$reserve_date = $_POST['reserve_date'] ?? '';

// Initialize an empty array to hold reserved times
$reservedTimes = [];

// Fetch approved reservations based on room and reserve_date
if ($room && $reserve_date) {
    try {
        $stmt = $conn->prepare("SELECT time FROM reservations WHERE room = :room AND reserve_date = :reserve_date AND status = 'approved'");
        $stmt->bindParam(':room', $room);
        $stmt->bindParam(':reserve_date', $reserve_date);
        $stmt->execute();

        $reservedTimes = $stmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

// Return the reserved times as a JSON response
echo json_encode(['reservedTimes' => $reservedTimes]);
?>
