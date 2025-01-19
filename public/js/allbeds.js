async function loadAllBeds(bedroomtype) {
    const bedContainer = document.querySelector('#bedContainer');
    const loader = document.getElementById('loader');
  
    // Show the loader
    loader.style.display = 'block';
  
    try {
      // Fetch rooms from the API with the selected bedroom type
      const response = await fetch(`/api/available_bed.js?type=${encodeURIComponent(bedroomtype)}`);
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        bedContainer.innerHTML = '<p class="error-message">Failed to load rooms. Please try again later.</p>';
        return;
      }
  
      const beds = await response.json();
  
      // Clear existing bed elements
      bedContainer.innerHTML = '';
  
      beds.forEach(bed => {
        // Create a bed card
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
  
        // Append the bed card to the container
        bedContainer.appendChild(bedCard);
      });
    } catch (error) {
      console.error('An error occurred:', error);
      bedContainer.innerHTML = '<p class="error-message">An unexpected error occurred. Please try again later.</p>';
    } finally {
      // Hide the loader
      loader.style.display = 'none';
    }
  }
  