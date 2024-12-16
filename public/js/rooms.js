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

      // Set the original price
      originalPrice = data.prices;

        // Populate the HTML with room details
        document.getElementById('roomImage').src = baseImageUrl + data.room_photo;
        document.getElementById('roomGuest').value = data.capacity;
        document.getElementById('roomID').value = data.room_id;
        document.getElementById('roomPrices').textContent = originalPrice; // Default price
        document.getElementById('roomName').value = data.room_name;
        document.getElementById('roomNameView').textContent = data.room_name;
        document.getElementById('roomUsage').textContent = data.usage;
        document.getElementById('roomCapacity').textContent = `${data.capacity} people`;
        document.getElementById('roomFeatures').textContent = data.features;

        // Add event listener to the time dropdown
        const timeSelector = document.getElementById('time');
        timeSelector.addEventListener('change', (event) => {
            const selectedTime = event.target.value; // Get the selected time range
            let adjustedPrice = originalPrice; // Default to original price

            // Adjust price based on the selected time range
            if (selectedTime === '7:00AM-12:00PM') {
                adjustedPrice *= 0.5; // Half-day morning: 50% of the original price
            } else if (selectedTime === '1:00PM-6:00PM') {
                adjustedPrice *= 0.5; // Half-day afternoon: 50% of the original price
            } else if (selectedTime === '7:00AM-6:00PM') {
                adjustedPrice *= 1.0; // Whole day: 100% of the original price
            }

            // Update the displayed price
            document.getElementById('roomPrices').textContent = adjustedPrice;
        });

      } catch (error) {
        console.error('Error fetching room details:', error);
        // Redirect to 404 page if room details are not found
        window.location.href = '/404';
      }
    } else {
      console.error('No room ID provided');
      // Redirect to 404 page if no room ID is provided
      window.location.href = '/404';
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
