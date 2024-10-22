

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
  return fetch(`includes/${file}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(elementID).innerHTML = data;
    })
    .catch(error => console.error('Error loading HTML:', error));
}

// Load navigation and footer
Promise.all([
  includeHTML('header', 'header'),
  includeHTML('footer', 'footer')
]).then(() => {
  // Call loadRooms only after the header has been loaded
  loadRooms();
  loadAllRooms();
});
  
  async function loadRooms() {
    const dropdown = document.querySelector('#roomDropdown');
   
    // Fetch rooms from the API
    const response = await fetch('/api/available_rooms.js');
  
    // If the response is not OK, log an error and return
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return; // Exit if the response is not OK
    }

    const rooms = await response.json();

    // Check if there are any rooms
    if (rooms.length === 0) {
      dropdown.innerHTML = '<a class="dropdown-item" href="#">No rooms available</a>'; // Message if no rooms
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
  }
  async function loadAllRooms() {
    const roomContainer = document.querySelector('.row'); // Adjust this selector to target the correct container for the rooms

    // Fetch rooms from the API
    const response = await fetch('/api/available_rooms.js');

    // If the response is not OK, log an error and return
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return; // Exit if the response is not OK
    }

    const rooms = await response.json();

    // Clear existing room elements
    roomContainer.innerHTML = '';

    rooms.forEach(room => {
        // Create a room card
        const roomCard = document.createElement('div');
        roomCard.className = 'col-md-4 mb-4 element-animate';

        roomCard.innerHTML = `
            <div class="media d-block room mb-0">
                <figure class="zoom">
                    <img id="roomImage" src="${room.room_photo}" alt="${room.room_name}" class="img-fluid zoom-on-hover">
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

    dropdown.dataset.loaded = 'true';
  }


  document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const encodedRoomId = params.get('ID'); // Get the encoded ID
    const roomId = decodeURIComponent(encodedRoomId);

    // const baseImageUrl = `https://raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/room-photo/`;
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
    
    if (roomId) {
      try {
        const response = await fetch(`/api/room-details?room_id=${roomId}`);
        if (!response.ok) throw new Error('Room not found');

        const data = await response.json();

        // Populate the HTML with room details
        document.getElementById('roomImage').src = baseImageUrl + data.room_photo;
        document.getElementById('roomID').value = data.room_id;
        document.getElementById('roomName').textContent = data.room_name;
        document.getElementById('roomUsage').textContent = data.usage;
        document.getElementById('roomCapacity').textContent = `${data.capacity} people`;
        document.getElementById('roomFeatures').textContent = data.features;
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    } else {
      console.error('No room ID provided');
    }
  });



// async function getEncryptionKey() {
//     const response = await fetch('/api/encryption-key'); 
//     if (!response.ok) throw new Error('Failed to fetch encryption key');
//     const { key } = await response.json();
//     return new TextEncoder().encode(key.padEnd(32, ' ').slice(0, 32)); // Ensure correct length and encoding
// }


// async function decrypt(encryptedText, key) {
//   const [ivHex, encryptedDataHex] = encryptedText.split(':');
//   const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
//   const encryptedData = hexToBuffer(encryptedDataHex);

//   const cryptoKey = await crypto.subtle.importKey(
//       'raw',
//       key, // Use pre-encoded key here
//       { name: 'AES-CBC' },
//       false,
//       ['decrypt']
//   );

//   const decryptedBuffer = await crypto.subtle.decrypt(
//       { name: 'AES-CBC', iv },
//       cryptoKey,
//       encryptedData
//   );

//   return new TextDecoder().decode(decryptedBuffer);
// }

// function hexToBuffer(hex) {
//   return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     const params = new URLSearchParams(window.location.search);
//     const encodedRoomId = params.get('ID');
//     const roomId = decodeURIComponent(encodedRoomId);

//     const [encryptedResponse, encryptionKey] = await Promise.all([
//         fetch('/api/fetch-image').then(res => res.json()),
//         getEncryptionKey()
//     ]);

//     const decryptedData = await decrypt(encryptedResponse.encryptedData, encryptionKey);
//     const configData = JSON.parse(decryptedData);

//     const baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/room-photo/`;

//     if (roomId) {
//         try {
//             const response = await fetch(`/api/room-details?room_id=${roomId}`);
//             if (!response.ok) throw new Error('Room not found');

//             const data = await response.json();

//             document.getElementById('roomImage').src = baseImageUrl + data.room_photo;
//             document.getElementById('roomID').value = data.room_id;
//             document.getElementById('roomName').textContent = data.room_name;
//             document.getElementById('roomUsage').textContent = data.usage;
//             document.getElementById('roomCapacity').textContent = `${data.capacity} people`;
//             document.getElementById('roomFeatures').textContent = data.features;
//         } catch (error) {
//             console.error('Error fetching room details:', error);
//         }
//     } else {
//         console.error('No room ID provided');
//     }
// });
