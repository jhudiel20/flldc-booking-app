  document.querySelector('#signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const formData = {
      fname: document.getElementById('fname').value,
      lname: document.getElementById('lname').value,
      email: document.getElementById('email').value,
      password: document.getElementById('new-password').value,
      userType: document.getElementById('usertype').value,
      branch: document.getElementById('branchSelect').value,
      sbu: document.getElementById('SBU').value,
    };
  
    $.ajax({
      url: '/api/UserRegistration',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        console.log('User registered successfully!');
      },
      error: function(xhr, status, error) {
        console.error('Error during registration:', error);
      }
    });
  });
  
  
  

  