// document.addEventListener('DOMContentLoaded', () => {
//   const roomDropdown = document.getElementById('roomDropdown');

//   // Fetch room data from the backend
//   fetch('/api/available_rooms')
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((rooms) => {
//       // Clear the dropdown first (if needed)
//       // roomDropdown.innerHTML = ''; 

//       // Add the "All Rooms" option at the top
//       // const allRoomsLink = document.createElement('a');
//       // allRoomsLink.classList.add('dropdown-item');
//       // allRoomsLink.href = 'rooms';
//       // allRoomsLink.textContent = 'All Rooms';
//       // roomDropdown.appendChild(allRoomsLink);

//       // Add each room dynamically
//       rooms.forEach((room) => {
//         const roomLink = document.createElement('a');
//         roomLink.classList.add('dropdown-item');
//         roomLink.href = `rooms?ID=${room.room_id}`;  // Example: rooms301
//         roomLink.textContent = room.name;  // Assuming 'name' is a column

//         roomDropdown.appendChild(roomLink);
//       });
//     });
// });


// document.addEventListener('load', () => {
//   const roomDropdown = document.getElementById('roomDropdown');

//   if (!roomDropdown) {
//       console.error('roomDropdown element not found!');
//       return; // Exit if the element is not found
//   }

//   // Fetch room data from the backend
//   fetch('/api/available_rooms')
//       .then((response) => {
//           if (!response.ok) {
//               throw new Error('Failed to fetch room data');
//           }
//           return response.json();
//       })
//       .then((rooms) => {
//           console.log('Fetched Rooms:', rooms); // Log fetched rooms

//           // Check if rooms data is empty
//           if (rooms.length === 0) {
//               const noRoomItem = document.createElement('p');
//               noRoomItem.classList.add('dropdown-item', 'text-muted');
//               noRoomItem.textContent = 'No rooms available';
//               roomDropdown.appendChild(noRoomItem);
//               return;
//           }

//           // Populate dropdown with room data
//           rooms.forEach((room) => {
//               const roomLink = document.createElement('a');
//               roomLink.classList.add('dropdown-item');
//               roomLink.href = `rooms?ID=${room.room_id}`; // Use query parameter for room ID
//               roomLink.textContent = room.name; // Assuming 'name' is a column in 'room_details'

//               roomDropdown.appendChild(roomLink);
//           });
//       })
//       .catch((error) => {
//           console.error('Error fetching room data:', error);
//           const errorItem = document.createElement('p');
//           errorItem.classList.add('dropdown-item', 'text-danger');
//           errorItem.textContent = 'Unable to load rooms';
//           roomDropdown.appendChild(errorItem);
//       });
// });
// console.log(document.getElementById('roomDropdown'));

window.onload = function() {
  const roomDropdown = document.getElementById('roomDropdown');

  if (!roomDropdown) {
      console.error('roomDropdown element not found!');
      return; // Exit if the element is not found
  }

  // Fetch room data from the backend
  fetch('/api/available_rooms')
      .then((response) => {
          if (!response.ok) {
              throw new Error('Failed to fetch room data');
          }
          return response.json();
      })
      .then((rooms) => {
          rooms.forEach((room) => {
              const roomLink = document.createElement('a');
              roomLink.classList.add('dropdown-item');
              roomLink.href = `rooms?ID=${room.room_id}`; // Use query parameter for room ID
              roomLink.textContent = room.name; // Assuming 'name' is a column in 'room_details'

              roomDropdown.appendChild(roomLink);
          });
      })
      .catch((error) => {
          console.error('Error fetching room data:', error);
          const errorItem = document.createElement('p');
          errorItem.classList.add('dropdown-item', 'text-danger');
          errorItem.textContent = 'Unable to load rooms';
          roomDropdown.appendChild(errorItem);
      });
};






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




