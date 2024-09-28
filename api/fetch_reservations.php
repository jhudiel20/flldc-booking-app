<?php
// Include your database connection file
require_once 'DBConnection.php';

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
