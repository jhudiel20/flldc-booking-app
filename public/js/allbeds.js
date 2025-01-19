async function loadAllBeds(bedroomtype) {
    console.log("Loading beds for type:", bedroomtype);  // Debugging line
    const bedContainer = document.querySelector('#bedContainer');
    const loader = document.getElementById('loader');
  
    // Show the loader
    loader.style.display = 'block';
  
    try {
      const response = await fetch(`/api/available_bed?type=${encodeURIComponent(bedroomtype)}`);
  
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        bedContainer.innerHTML = '<p class="error-message">Failed to load rooms. Please try again later.</p>';
        return;
      }
  
      const beds = await response.json();
      console.log(beds);  // Log the beds data to check if it's being fetched
  
      bedContainer.innerHTML = '';  // Clear the existing content
  
      if (beds.length === 0) {
        bedContainer.innerHTML = '<p>No rooms available.</p>';
        return;
      }
  
      beds.forEach(bed => {
        const bedCard = document.createElement('div');
        bedCard.className = 'col-md-4 mb-4';
  
        bedCard.innerHTML = `
          <div class="media d-block room mb-0">
            <div class="media-body">
              <h3 class="mt-0"><a href="beds?ID=${encodeURIComponent(bed.bed_id)}">${bed.bed_name}</a></h3>
              <p>Features:</p>
              <p>${bed.bed_desc}</p>
              <p><a href="beds?ID=${encodeURIComponent(bed.bed_id)}" class="btn btn-primary btn-sm">Book Now</a></p>
            </div>
          </div>
        `;
  
        bedContainer.appendChild(bedCard);
      });
    } catch (error) {
      console.error('An error occurred:', error);
      bedContainer.innerHTML = '<p class="error-message">An unexpected error occurred. Please try again later.</p>';
    } finally {
      loader.style.display = 'none';
    }
  }
  