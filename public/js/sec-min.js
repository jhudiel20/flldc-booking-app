if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1500, // Animation duration
    once: false,    // Allows animations to happen every time you scroll past
    mirror: true    // Repeat animations on scroll-up
  });
}

function toggleExtras() {
  const extrasDiv = document.getElementById('extras');
  if (extrasDiv) {
    extrasDiv.classList.toggle('d-none'); // Toggle the d-none class
  } else {
    console.error('Element with ID "extras" not found.');
  }
}

// Get the current URL path (without domain and query parameters)
const currentPath = window.location.pathname.split('/').pop() || 'index';

// Get all nav-link elements
const navLinks = document.querySelectorAll('.nav-link');

// Iterate through each nav-link and compare its href with the current path
navLinks.forEach(link => {
  const linkPath = link.getAttribute('href');
  if (linkPath === currentPath) {
    link.classList.add('active');
  }
});

// Function to load HTML files from the 'includes' folder into a specified element
function includeHTML(file, elementID) {
  return fetch(`includes/${file}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      const element = document.getElementById(elementID);
      if (element) {
        element.innerHTML = data;
      } else {
        console.error(`Element with ID "${elementID}" not found.`);
      }
    })
    .catch(error => console.error('Error loading HTML:', error));
}

// Load navigation and footer
Promise.all([
  includeHTML('header', 'header'),
  includeHTML('footer', 'footer')
]).then(() => {
  // Call loadRooms only after the header has been loaded
  if (typeof loadRooms === 'function') {
    loadRooms();
  }
  if (typeof loadAllRooms === 'function') {
    loadAllRooms();
  }
});

async function loadRooms() {
  const dropdown = document.querySelector('#roomDropdown');
  if (!dropdown) {
    console.error('Dropdown element with ID "roomDropdown" not found.');
    return;
  }

  try {
    const response = await fetch('/api/available_rooms.js');
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }

    const rooms = await response.json();
    if (rooms.length === 0) {
      dropdown.innerHTML = '<a class="dropdown-item" href="#">No rooms available</a>';
      return;
    }

    dropdown.innerHTML = '';

    const allRoomsLink = document.createElement('a');
    allRoomsLink.classList.add('dropdown-item');
    allRoomsLink.href = 'allrooms';
    allRoomsLink.textContent = 'All Rooms';
    dropdown.appendChild(allRoomsLink);

    rooms.forEach(room => {
      const roomLink = document.createElement('a');
      roomLink.className = 'dropdown-item';
      const encodedRoomId = encodeURIComponent(room.room_id);
      roomLink.href = `rooms?ID=${encodedRoomId}`;
      roomLink.textContent = room.room_name;
      dropdown.appendChild(roomLink);
    });

    dropdown.dataset.loaded = 'true';
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}
