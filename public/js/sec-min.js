

if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1500, // Animation duration
    once: false,    // Allows animations to happen every time you scroll past
    mirror: true    // Repeat animations on scroll-up
  });
}

function toggleExtras() {
  const extrasDiv = document.getElementById('extras');
  extrasDiv.classList.toggle('d-none');  // Toggle the d-none class
}

// Get the current URL path (without domain and query parameters)
 const currentPath = window.location.pathname.split('/').pop() || 'index';

//  console.log(currentPath);

 // Get all nav-link elments
 const navLinks = document.querySelectorAll('.nav-link');

 // Iterate through each nav-link and compare its href with the current path
 navLinks.forEach(link => {
   // Extract the relative path from the href attribute
   const linkPath = link.getAttribute('href');

   // If the href matches the current path, add the 'active' class
   if (linkPath === currentPath) {
     link.classList.add('active');
   }
 });


// Function to load HTML files from the 'includes' folder into a specified element
function includeHTML(file, elementID) {
    fetch(`includes/${file}.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById(elementID).innerHTML = data;
      })
      .catch(error => console.error('Error loading HTML:', error));
  }

  // Load navigation and footer
  includeHTML('header', 'header');
  includeHTML('footer', 'footer');

  // document.addEventListener('DOMContentLoaded', async () => {
  //   const dropdown = document.getElementById('roomDropdown');

  //   if (!dropdown) {
  //     console.error('Dropdown element not found!');
  //     return; // Prevent further execution if the element isn't found
  //   }

  //   try {
  //     const response = await fetch('/api/available_rooms.js');
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const rooms = await response.json();

  //     rooms.forEach(room => {
  //       const roomLink = document.createElement('a');
  //       roomLink.className = 'dropdown-item';
  //       roomLink.href = `rooms?ID=${room.room_id}`; // Adjust as needed
  //       roomLink.textContent = room.room_name;
  //       dropdown.appendChild(roomLink);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching room data:', error);
  //     const errorItem = document.createElement('a');
  //     errorItem.className = 'dropdown-item';
  //     errorItem.textContent = 'No rooms available';
  //     dropdown.appendChild(errorItem);
  //   }
  // });

  // window.onload = async () => {
  //   const dropdown = document.getElementById('roomDropdown');
  
  //   if (!dropdown) {
  //     console.error('Dropdown element not found!');
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch('/api/available_rooms.js');
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const rooms = await response.json();
  
  //     rooms.forEach(room => {
  //       const roomLink = document.createElement('a');
  //       roomLink.className = 'dropdown-item';
  //       roomLink.href = `rooms?ID=${room.room_id}`;
  //       roomLink.textContent = room.room_name;
  //       dropdown.appendChild(roomLink);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching room data:', error);
  //     const errorItem = document.createElement('a');
  //     errorItem.className = 'dropdown-item';
  //     errorItem.textContent = 'No rooms available';
  //     dropdown.appendChild(errorItem);
  //   }
  // };

  document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded...');
    
    const dropdown = document.querySelector('#roomDropdown');
    console.log('Dropdown element:', dropdown);
  
    if (!dropdown) {
      console.error('Dropdown element not found!');
      return;
    }
  
    try {
      const response = await fetch('/api/available_rooms.js');
      console.log('Fetch response:', response);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const rooms = await response.json();
      console.log('Rooms data:', rooms);
  
      rooms.forEach(room => {
        const roomLink = document.createElement('a');
        roomLink.className = 'dropdown-item';
        roomLink.href = `rooms?ID=${room.room_id}`;
        roomLink.textContent = room.room_name;
        dropdown.appendChild(roomLink);
      });
    } catch (error) {
      console.error('Error fetching room data:', error);
      const errorItem = document.createElement('a');
      errorItem.className = 'dropdown-item';
      errorItem.textContent = 'No rooms available';
      dropdown.appendChild(errorItem);
    }
  });
  
  