async function loadAllRooms() {
    const bedContainer = document.querySelector('#bedContainer');
    let bedroomtype = document.getElementById('bedroomtype').value;

    // const loadingMessage = document.createElement('div');
    // loadingMessage.className = 'loading-message';
    // loadingMessage.innerHTML = '<p>Loading rooms...</p>'; // You can customize this message
    // roomContainer.appendChild(loadingMessage);


    // Show the loader
    loader.classList.add('show');

    // Fetch rooms from the API
    const response = await fetch('/api/available_bed.js');

    // If the response is not OK, log an error and return
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        loader.classList.remove('show'); // Hide loader
        // loadingMessage.remove();
        return; // Exit if the response is not OK
    }

    const beds = await response.json();

    // Clear existing room elements
    // roomContainer.innerHTML = '';

    beds.forEach(bed => {
        // Create a room card
        const bedCard = document.createElement('div');
        bedCard.className = 'col-md-4 mb-4';

        bedCard.innerHTML = `
            <div class="media d-block room mb-0">
                <div class="media-body">
                    <h3 class="mt-0"><a href="beds?ID=${encodeURIComponent(bed.bed_id)}">${bed.bed_name}</a></h3>
                    <p>Features:</p>
                    <p>${bed.bed_desc}</p>              
                    <p><a href="beds?ID=${encodeURIComponent(room.bed_id)}" class="btn btn-primary btn-sm">Book Now</a></p>
                </div>
            </div>
        `;

        // Append the room card to the room container
        bedContainer.appendChild(bedCard);
    });
    loader.classList.remove('show');
    // loadingMessage.remove();
}