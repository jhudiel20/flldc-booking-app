<?php

require '../../../DBConnection.php';
include '../../../config/config.php';

// Assuming you already have established a database connection $conn

// Fetch data from the database
$sql = mysqli_query($conn, "SELECT * FROM calendar_events");

// Set the default timezone to Manila
date_default_timezone_set('Asia/Manila');

// Initialize an empty array to store the events
$events = [];

// Loop through the results and format them into the desired structure
while ($row = mysqli_fetch_assoc($sql)) {
    // Format the date and nextDay variables based on your data
    $date = date('Y-m-d H:i:s', strtotime($row['START_DATE']));
    $nextDay = date('Y-m-d H:i:s', strtotime($row['END_DATE']));

    // Create an event object and push it to the events array
    $event = [
        'id' => $row['ID'], // Assuming 'id' is the column name in your database for the event ID
        'url' => '', // You can update this if you have a URL for the event
        'title' => $row['TITLE'], // Assuming 'title' is the column name in your database for the event title
        'start' => $date,
        'end' => $nextDay,
        'allDay' => $row['ALL_DAY'], // Assuming the events are not all-day events
        'location' => $row['LOCATION'], // Assuming 'location' is the column name in your database for the event location
        'description' => $row['DESCRIPTION'], // Assuming 'description' is the column name in your database for the event description
        'extendedProps' => [
            'calendar' => $row['LABEL'] // Assuming 'Business' is the calendar type for these events
        ]
    ];
    
    // Push the event to the events array
    $events[] = $event;
}

// Convert the events array to JSON format
$events_json = json_encode(['events' => $events]);

// Output the JSON response
header('Content-Type: application/json');
echo $events_json;
?>
