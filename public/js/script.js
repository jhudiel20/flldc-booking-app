document.getElementById('bookingForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const room = formData.get('room');
    const date = formData.get('date');
  
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ room, date })
    });
  
    const result = await response.json();
    alert(result.message);
  });
  