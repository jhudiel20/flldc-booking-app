async function loadAllBeds(bedroomtype) {
    console.log("Loading beds for type:", bedroomtype);  // Debugging line
    const bedContainer = document.querySelector('#bedContainer');
    const loader = document.getElementById('loader');
  
    // Show the loader
    loader.style.display = 'block';

    try {
      const response = await fetch(`/api/available_bed?bedroomtype=${bedroomtype}`);
  
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        bedContainer.innerHTML = '<p class="error-message">Failed to load rooms. Please try again later.</p>';
        return;
      }
  
      const beds = await response.json();
      console.log(beds);  // Log the beds data to check if it's being fetched
  
      bedContainer.innerHTML = '';  // Clear the existing content
  
      if (beds.length === 0) {
        bedContainer.innerHTML = '<p>No beds available.</p>';
        return;
      }
  
      beds.forEach(bed => {
        const bedCard = document.createElement('div');
        bedCard.className = 'col-md-4 mb-4';
  
        // Use a placeholder image URL (you can use Unsplash or Lorem Picsum for random images)
        const imageUrl = `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`;
  
        bedCard.innerHTML = `
          <div class="card" style="width: 18rem;">
            <img src="${imageUrl}" class="card-img-top" alt="${bed.bed_name}">
            <div class="card-body">
              <h5 class="card-title">${bed.bed_name}</h5>
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
  