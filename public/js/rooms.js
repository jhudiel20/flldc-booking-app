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
        document.getElementById('roomGuest').value = data.capacity;
        document.getElementById('roomID').value = data.room_id;
        document.getElementById('roomName').value = data.room_name;
        document.getElementById('roomNameView').textContent = data.room_name;
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
