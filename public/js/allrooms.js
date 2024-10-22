async function loadAllRooms() {
    const roomContainer = document.getElementById('roomContainer'); // Ensure this ID matches your HTML

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
    roomContainer.innerHTML = '';

    rooms.forEach(room => {
        // Create card wrapper
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'col-md-4 mb-4 element-animate';

        // Create media block
        const mediaBlock = document.createElement('div');
        mediaBlock.className = 'media d-block room mb-0';

        // Create figure
        const figure = document.createElement('figure');
        figure.className = 'zoom';

        // Create image
        const image = document.createElement('img');
        image.id = 'roomImage';
        image.src = baseImageUrl + room.room_photo;
        image.alt = room.room_name;
        image.className = 'img-fluid zoom-on-hover';

        // Create overlap text
        const overlapText = document.createElement('div');
        overlapText.className = 'overlap-text';
        const overlapSpan = document.createElement('span');
        overlapSpan.innerHTML = `Featured Room 
            <span class="ion-ios-star"></span>
            <span class="ion-ios-star"></span>
            <span class="ion-ios-star"></span>`;
        overlapText.appendChild(overlapSpan);

        // Create media body
        const mediaBody = document.createElement('div');
        mediaBody.className = 'media-body';

        // Create room title
        const roomTitle = document.createElement('h3');
        roomTitle.className = 'mt-0';
        const roomLink = document.createElement('a');
        roomLink.href = `rooms?ID=${encodeURIComponent(room.room_id)}`;
        roomLink.textContent = room.room_name;
        roomTitle.appendChild(roomLink);

        // Create features paragraph
        const featuresPara = document.createElement('p');
        featuresPara.textContent = 'Features:';

        // Create specs list
        const specsList = document.createElement('ul');
        specsList.className = 'room-specs';

        const capacityItem = document.createElement('li');
        capacityItem.innerHTML = `<span class="ion-ios-people-outline"></span> ${room.capacity} Guests`;
        specsList.appendChild(capacityItem);

        const sizeItem = document.createElement('li');
        sizeItem.innerHTML = `<span class="ion-ios-crop"></span> ${room.size} ft<sup>2</sup>`;
        specsList.appendChild(sizeItem);

        // Create usage paragraph
        const usagePara = document.createElement('p');
        usagePara.textContent = 'Usage:';
        
        const usageDescription = document.createElement('p');
        usageDescription.textContent = room.usage;

        // Create book now button
        const bookNowPara = document.createElement('p');
        const bookNowLink = document.createElement('a');
        bookNowLink.href = `rooms?ID=${encodeURIComponent(room.room_id)}`;
        bookNowLink.className = 'btn btn-primary btn-sm';
        bookNowLink.textContent = 'Book Now';
        bookNowPara.appendChild(bookNowLink);

        // Assemble the media body
        mediaBody.appendChild(roomTitle);
        mediaBody.appendChild(featuresPara);
        mediaBody.appendChild(specsList);
        mediaBody.appendChild(usagePara);
        mediaBody.appendChild(usageDescription);
        mediaBody.appendChild(bookNowPara);

        // Assemble the figure
        figure.appendChild(image);
        figure.appendChild(overlapText);

        // Assemble the media block
        mediaBlock.appendChild(figure);
        mediaBlock.appendChild(mediaBody);

        // Assemble the card wrapper
        cardWrapper.appendChild(mediaBlock);

        // Append the card to the container
        roomContainer.appendChild(cardWrapper);
    });
}
