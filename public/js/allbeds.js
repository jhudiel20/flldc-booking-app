document.addEventListener('DOMContentLoaded', () => {
    const bedOptions = document.querySelectorAll('.bed-option');
    
    bedOptions.forEach(option => {
      option.addEventListener('click', event => {
        event.preventDefault(); // Prevent default link behavior
        const bedroomType = event.target.getAttribute('data-type');
        loadAllBeds(bedroomType);
      });
    });
  });
  
  async function loadAllBeds(bedroomType) {
    const bedContainer = document.querySelector('#bedContainer');
    const loader = document.querySelector('#loader');
  
    // Show the loader
    loader.style.display = 'block';
  
    try {
      // Fetch beds from the API
      const response = await fetch(`/api/available_bed.js?type=${encodeURIComponent(bedroomType)}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const beds = await response.json();
  
      // Clear existing bed elements
      bedContainer.innerHTML = '';
  
      // Populate bed cards
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
      bedContainer.innerHTML = '<p class="error-message">Failed to load beds. Please try again later.</p>';
    } finally {
      // Hide the loader
      loader.style.display = 'none';
    }
  }
  