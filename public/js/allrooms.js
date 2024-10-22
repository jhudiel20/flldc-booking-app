async function loadAllRooms() {
    const roomContainer = $('#roomContainer'); // Ensure this ID matches your HTML

    const response = await fetch('/api/available_rooms.js');

    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
    }

    const rooms = await response.json();
    console.log(rooms); // Debug: Check the room data

    let baseImageUrl = '';
    try {
        const configResponse = await fetch('/api/fetch-image');
        if (configResponse.ok) {
            const configData = await configResponse.json();
            baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/room-photo/`;
        } else {
            console.error('Failed to fetch config');
        }
    } catch (error) {
        console.error('Error fetching config:', error);
    }

    // Clear existing room elements
    roomContainer.empty();

    rooms.forEach(room => {
        const roomHTML = `
            <div class="col-md-4 mb-4 element-animate">
                <div class="media d-block room mb-0">
                    <figure class="zoom">
                        <img id="roomImage" src="${baseImageUrl + room.room_photo}" alt="${room.room_name}" class="img-fluid zoom-on-hover">
                        <div class="overlap-text">
                            <span>
                                Featured Room 
                                <span class="ion-ios-star"></span>
                                <span class="ion-ios-star"></span>
                                <span class="ion-ios-star"></span>
                            </span>
                        </div>
                    </figure>
                    <div class="media-body">
                        <h3 class="mt-0"><a href="rooms?ID=${encodeURIComponent(room.room_id)}">${room.room_name}</a></h3>
                        <p>Features:</p>
                        <ul class="room-specs">
                            <li><span class="ion-ios-people-outline"></span> ${room.capacity} Guests</li>
                            <li><span class="ion-ios-crop"></span> ${room.size} ft<sup>2</sup></li>
                        </ul>
                        <p>Usage:</p>
                        <p>${room.usage}</p>              
                        <p><a href="rooms?ID=${encodeURIComponent(room.room_id)}" class="btn btn-primary btn-sm">Book Now</a></p>
                    </div>
                </div>
            </div>
        `;

        // Append room HTML using jQuery
        roomContainer.append(roomHTML);
    });
}
