async function loadAllRooms() {
    const roomContainer = document.querySelector('#roomContainer');

    // const loadingMessage = document.createElement('div');
    // loadingMessage.className = 'loading-message';
    // loadingMessage.innerHTML = '<p>Loading rooms...</p>'; // You can customize this message
    // roomContainer.appendChild(loadingMessage);


    // Show the loader
    loader.classList.add('show');

    // Fetch rooms from the API
    const response = await fetch('/api/available_rooms.js');

    // If the response is not OK, log an error and return
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        loader.classList.remove('show'); // Hide loader
        // loadingMessage.remove();
        return; // Exit if the response is not OK
    }

    const rooms = await response.json();

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
    // roomContainer.innerHTML = '';

    rooms.forEach(room => {
        // Create a room card
        const roomCard = document.createElement('div');
        roomCard.className = 'col-md-4 mb-4';

        roomCard.innerHTML = `
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
                        <li><span class="ion-ios-crop"></span> ft<sup>2</sup></li>
                    </ul>
                    <p>Usage:</p>
                    <p>${room.usage}</p>              
                    <p><a href="rooms?ID=${encodeURIComponent(room.room_id)}" class="btn btn-primary btn-sm">Book Now</a></p>
                </div>
            </div>
        `;

        // Append the room card to the room container
        roomContainer.appendChild(roomCard);
    });
    loader.classList.remove('show');
    // loadingMessage.remove();
}