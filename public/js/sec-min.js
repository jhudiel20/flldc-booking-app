const branches = [
    "ALABANG", "ALABANG-FMM", "ALABANG-RETAIL", "AZUCENA-PMFTC OVERFLOW", 
    "BACOLOD", "BACOLOD-NA", "BACOLOD-PERSONAL COLLECTION", "BACOLOD-SHELL", 
    "BALITE-PMFTC OVERFLOW", "BASILAN", "BATANGAS", "BATANGAS-CDI", 
    "BATANGAS-CDO FOODSPHERE RETAIL", "BATANGAS-HONDA", "BATANGAS-NPI", 
    "BATANGAS-NPI RETAIL", "BATANGAS-PMFTC", "BATANGAS-PMFTC OVERFLOW", 
    "BATANGAS-SAFI", "BATANGAS-YAMAHA", "BATINO-NPI EXTENSION", 
    "BATINO-NPI ICD", "BATINO-NPI RETAIL", "BATINO-NPI SDC", "BATINO-SDC TRUCKING", 
    "BATINO-TRUCKING", "BAYBAY", "BORONGAN", "BULACAN-NDC TRUCKING", 
    "BULACAN-NPI NDC", "BULACAN-NPI NDC CAW", "BUTUAN", "CABUYAO", 
    "CABUYAO-ABBOTT", "CABUYAO-ABBOTT-RETAIL", "CABUYAO-ACTIMED INC.", 
    "CABUYAO-DMPI", "CABUYAO-EC OVERFLOW", "CABUYAO-FAPC", "CABUYAO-GREEN CROSS INC.", 
    "CABUYAO-J&J", "CABUYAO-J&J RETAIL", "CABUYAO-J&J TRANSPORT", "CABUYAO-L&D CENTER", 
    "CABUYAO-LAGUNA", "CABUYAO-MEGA PACK", "CABUYAO-NA RETAIL", "CABUYAO-NPI", 
    "CABUYAO-NPI DC", "CABUYAO-NPI LISP FG", "CABUYAO-NPI MMC3", "CABUYAO-NPI OVERFLOW", 
    "CABUYAO-NPI RETAIL", "CABUYAO-NPI TRUCKING", "CABUYAO-NUTRIASIA", 
    "CABUYAO-P&G", "CABUYAO-P&G RETAIL", "CABUYAO-PERSONAL COLLECTION", 
    "CABUYAO-PMFTC OVERFLOW", "CABUYAO-PMFTC1", "CABUYAO-PMFTC2", "CABUYAO-RENGO", 
    "CABUYAO-RFM", "CABUYAO-UNILEVER", "CABUYAO-URC", "CABUYAO-VMI RETAIL", 
    "CAGAYAN", "CAGAYAN - NPI CDC RETAIL", "CAGAYAN-DMPI", "CAGAYAN-DMPI RETAIL", 
    "CAGAYAN-FACILITY", "CAGAYAN-FMM", "CAGAYAN-GMC", "CAGAYAN-NPI", 
    "CAGAYAN-NPI PHARMA", "CAGAYAN-NPI RETAIL", "CAGAYAN-PERSONAL COLLECTION", 
    "CAGAYAN-PMFTC", "CAGAYAN-ROBINSONS", "CAGAYAN-SHELL", "CAGAYAN-SILVERSWAN", 
    "CAGAYAN-URC", "CAINTA-MONDELEZ", "CALAMBA OVERFLOW", "CALAMBA-ALFAMART", 
    "CALAMBA-DISTRIPHIL", "CALAMBA-GREEN CROSS INC.", "CALAMBA-JAPAN TOBACCO INT'L.", 
    "CALAMBA-JAPAN TOBACCO INT'L. OVERFLOW", "CALAMBA-JOLLIBEE", "CALAMBA-LAGUNA", 
    "CALAMBA-MMC SDC", "CALAMBA-P&G", "CALAMBA-RED RIBBON SITE", "CALAMBA-RFM", 
    "CALAMBA-RFM RETAIL", "CALAMBA-WYETH", "CALBAYOG", "CALBAYOG-NA", 
    "CALBAYOG-NPI", "CAMIGUIN", "CANLUBANG-EDWARD KELLER", "CANLUBANG-ZUELLIG", 
    "CARMONA-KALINISAN CHEMICALS CORP.", "CARMONA-LAFARGE", "CARMONA-LAFARGE RETAIL", 
    "CARMONA-OVERFLOW 1", "CARMONA-OVERFLOW 2", "CATARMAN", "CATBALOGAN-NPI", 
    "CAUAYAN-ZUELLIG", "CEBU", "CEBU-CDI", "CEBU-COLPAL", "CEBU-EPI", "CEBU-FACILITY", 
    "CEBU-FACILITY 2", "CEBU-FDI", "CEBU-FMM", "CEBU-GMC", "CEBU-GREEN CROSS", 
    "CEBU-JJPI RDC", "CEBU-JOLLIBEE CONSO", "CEBU-JOLLIBEE CONSO-2", "CEBU-KIMBERLY CLARK", 
    "CEBU-KIMBERLY CLARK RETAIL", "CEBU-MARIWASA", "CEBU-MONDE NISSIN", "CEBU-NA", 
    "CEBU-NATIONAL BOOKSTORE", "CEBU-NEXTRADE", "CEBU-NEXTRADE RETAIL", "CEBU-NPI ICD", 
    "CEBU-NPI PHARMA", "CEBU-NPI RETAIL", "CEBU-NPI VDC", "CEBU-NPI VDC OVERFLOW", 
    "CEBU-NPI VDC RETAIL", "CEBU-PERSONAL COLLECTION", "CEBU-PILMICO CONSO", 
    "CEBU-PRIFOOD", "CEBU-RFM", "CEBU-SHELL", "CEBU-SYSU", "CEBU-TRANSPORT", 
    "CEBU-URC", "CEBU-URC CONSO", "CEBU-URC SAN FERNANDO", "CEBU-WYETH", "CORPORATE", 
    "COTABATO", "COTABATO-DOLE RETAIL", "DAGUPAN", "DASMARIÑAS-GREEN CROSS INC", 
    "DASMARIÑAS-GREEN CROSS INC.-2", "DASMARIÑAS-OVERFLOW", "DASMARIÑAS-PMFTC OVERFLOW", 
    "DAVAO", "DAVAO-CDI", "DAVAO-CITIHARDWARE", "DAVAO-EPI", "DAVAO-FMM", 
    "DAVAO-JS UNITRADE", "DAVAO-JS UNITRADE RETAIL", "DAVAO-NA", "DAVAO-NEXTRADE", 
    "DAVAO-NPI PHARMA", "DAVAO-PERSONAL COLLECTION", "DAVAO-PERSONAL COLLECTION-2", 
    "DAVAO-PMFTC", "DAVAO-PRIFOOD", "DAVAO-RFM", "DAVAO-ROBINSONS", "DAVAO-SHELL", 
    "DAVAO-SILVER SWAN", "DAVAO-URC", "DAVAO-WYETH", "DIPOLOG", "DIPOLOG-MONDE NISSIN", 
    "DUMAGUETE", "DUMAGUETE-NA", "ELISCO-EPI TRANSPORT", "ELISCO-SHELL", "FLEX-CALAMBA", 
    "FLEX-TAGUIG", "FORTUNE-PMFTC1", "FORTUNE-PMFTC2", "GENSAN", "GENSAN-GMC", "HOME OFFICE", 
    "HOME OFFICE-FMM", "ILIGAN", "ILOILO", "ILOILO-COLPAL", "ILOILO-JAPAN TOBACCO INT'L", 
    "ILOILO-JS UNITRADE", "ILOILO-JS UNITRADE RETAIL", "ILOILO-NA", "ILOILO-NEXTRADE", 
    "ILOILO-PMFTC", "ILOILO-RFM", "ILOILO-SHELL", "ILOILO-SM", "IMUS-ALFAMART", 
    "IMUS-COLDCHAIN", "IMUS-COLDCHAIN RETAIL", "IMUS-FOOD PANDA", "IMUS-SM", "JOLO", 
    "KALIBO", "KALIBO-NPI", "KORONADAL", "LA UNION-CDI", "LAGUNA-GMC", "LAGUNA-MONDE NISSIN", 
    "LAGUNA-PRIFOOD", "LAGUNA-RED RIBBON", "LAPULAPU-PMFTC OVERFLOW", "LAS PIÑAS-BOIE", 
    "LAWA-OVERFLOW", "LIBIS OVERFLOW", "LIBIS-COLPAL", "LIBIS-PMFTC", "LIBIS-UNILEVER", 
    "MAKATI-ALFAMART", "MAKATI-CDI", "MAKATI-JOLLIBEE", "MAKATI-P&G", "MAKATI-PERSONAL COLLECTION", 
    "MAKATI-PG", "MANDAUE", "MANDAUE-NA", "MANDAUE-PMFTC OVERFLOW", "MAYON", "MINDANAO", 
    "MUNTINLUPA", "MUNTINLUPA-PMFTC", "NAGA", "NAGA-PERSONAL COLLECTION", "NAGA-PMFTC", 
    "NAGA-ROBINSONS", "NORTH COTABATO", "NORTH COTABATO-RETAIL", "ODIONGAN", "OLONGAPO", 
    "OLONGAPO-NPI", "OTTAWA", "ORIENTAL MINDORO", "ORIENTAL MINDORO-NA", "ORIENTAL MINDORO-NPI", 
    "PANGASINAN", "PASAY", "PASAY-PMFTC", "PASIG", "PASIG-NA", "PASIG-NPI", "PASIG-NPI RETAIL", 
    "PANGASINAN-NA", "PANGASINAN-PERSONAL COLLECTION", "PANGASINAN-URC", "PANGASINAN-PERSONAL COLLECTION", 
    "PAMPANGA", "PAMPANGA-CDI", "PAMPANGA-CDI-RETAIL", "PAMPANGA-NPI", "PAMPANGA-PERSONAL COLLECTION", 
    "PANGALAT", "ROXAS", "SANTIAGO", "SANTA ROSA", "SANTA ROSA-RETAIL", "TACLOBAN", "TAGUIG", 
    "TALISAY", "TALISAY-NA", "TALISAY-PMFTC", "TAYTAY-NA", "TAYTAY-PMFTC", "TOLEDO", "ZAMBOANGA"
  ];



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

// Ensure scripts run after DOM is fully loaded
    // Load navigation and footer after DOM is loaded
    Promise.all([
      includeHTML('header', 'header'),
      includeHTML('footer', 'footer')
    ]).then(() => {
      // Call loadRooms only after the header has been loaded
      checkUserStatus();
      loadRooms();
      if (typeof loadAllRooms === 'function') {
        loadAllRooms();
      }
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


  

  includeHTML('header', 'header').then(() => {
    const loginModal = document.getElementById('LoginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function (event) {
          event.preventDefault(); // Prevent default anchor link behavior
    
        const showLoginModal = (errorMessage = '') => {
            Swal.fire({
                title: 'Sign In',
                imageUrl: '/images/LOGO.png', // Replace with your logo path
                imageWidth: 140, // Adjust as needed
                imageHeight: 100, // Adjust as needed
                html: `
                  <div class="mb-3 text-start" style="text-align:left; position: relative;">
                      <div class="input-group">
                          <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                          <input type="email" id="email_login" class="form-control" placeholder=" " required>
                          <label for="email_login" class="floating-label">Email</label>
                      </div>
                  </div>
                  <div class="mb-3">
                      <div style="text-align:right">
                          <button id="forgotPasswordLink" class="btn btn-link p-0"
                              data-bs-toggle="tooltip" 
                              data-bs-offset="0,4"
                              data-bs-placement="top"
                              data-bs-html="true"
                              title="To reset your password, please click this link to process your reset.">
                              <small>Forgot Password?</small>
                          </button>
                      </div>
                      <div class="input-group">
                          <span class="input-group-text"><i class="fa fa-lock"></i></span>
                          <input type="password" id="password" class="form-control" placeholder="" required>
                          <span class="input-group-text" id="togglePassword" style="cursor: pointer;">
                              <i class="fa fa-eye"></i>
                          </span>
                          <label class="floating-label" for="password">Password</label>
                      </div>
                  </div>
                  <div id="errorMessage" class="text-danger mt-3">${errorMessage}</div>
                  <div class="mt-3">
                      <button id="registerLink" class="btn btn-link p-0">Don't have an account? Register here</button>
                  </div>
                  <div id="recaptcha-container" class="mt-3" style="display: flex; justify-content: center; align-items: center;"></div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Login',
                didOpen: () => {
                    grecaptcha.render('recaptcha-container', {
                        sitekey: '6LcEwdUqAAAAAFnSG67vpecp_r_Ow1TWd25DDKCX'
                    });

                    // Password toggle logic
                    document.getElementById('togglePassword').addEventListener('click', function () {
                      const passwordField = document.getElementById('password');
                      const eyeIcon = this.querySelector('i');

                      if (passwordField.type === "password") {
                          passwordField.type = "text";
                          eyeIcon.classList.remove("fa-eye");
                          eyeIcon.classList.add("fa-eye-slash");
                      } else {
                          passwordField.type = "password";
                          eyeIcon.classList.remove("fa-eye-slash");
                          eyeIcon.classList.add("fa-eye");
                      }
                    });
                },
                preConfirm: async () => {
                    const email = document.getElementById('email_login').value.trim();
                    const password = document.getElementById('password').value.trim();
                    const recaptchaResponse = grecaptcha.getResponse();
                    if (!recaptchaResponse) {
                        document.getElementById('errorMessage').innerText = 'Please verify the reCAPTCHA.';
                        return false;
                    }

                    if (!email || !password) {
                        document.getElementById('errorMessage').innerText = 'Please fill in all fields.';
                            return false;
                    }

                    try {
                      const loginData = {
                        email,
                        password,
                        recaptchaResponse                   
                      };

                      const response = await fetch('/api/UserLogin', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(loginData)
                      });

                      const result = await response.json();

                      if (result.error) {
                        document.getElementById('errorMessage').innerText = result.error;
                        return false; 
                      } else {
                          Swal.fire('Success!', 'Successfully Login.', 'success').then(() => {
                            window.location.reload();
                        });
                      }
                    } catch (error) {
                        document.getElementById('errorMessage').innerText = 'Login failed. Please try again.';
                        return false; 
                    }
                }
            });
        };
        showLoginModal();

        document.getElementById('forgotPasswordLink').addEventListener('click', function () {
          Swal.fire({
              title: 'Forgot Password',
              imageUrl: '/images/LOGO.png', // Replace with your logo path
              imageWidth: 140, // Adjust as needed
              imageHeight: 100, // Adjust as needed
              html: `  
                  <div class="mb-3 text-start" style="text-align:left">
                      <div class="input-group">
                          <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                          <input type="email" id="forgot_email" class="form-control" placeholder=" ">
                          <label for="forgot_email" class="floating-label">Email</label>
                      </div>
                  </div>

                  <div id="forgotErrorMessage" class="text-danger mt-3"></div>
                  <div id="recaptcha-container-forgot" class="mt-3" style="display: flex; justify-content: center; align-items: center;"></div>
              `,
              showCancelButton: true,
              confirmButtonText: 'Reset Password',
              didOpen: () => {
                  grecaptcha.render('recaptcha-container-forgot', {
                      sitekey: '6LcEwdUqAAAAAFnSG67vpecp_r_Ow1TWd25DDKCX'
                  });
              },
              preConfirm: async () => {
                  const email = document.getElementById('forgot_email').value.trim();
                  const recaptchaResponse = grecaptcha.getResponse();

                  if (!recaptchaResponse) {
                      document.getElementById('forgotErrorMessage').innerText = 'Please verify the reCAPTCHA.';
                      return false;
                  }

                  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                  if (!emailRegex.test(email)) {
                      document.getElementById('forgotErrorMessage').innerText = 'Please enter a valid email address.';
                      return false;
                  }

                  try {
                      const forgotPasswordData = { email, recaptchaResponse };
                      const response = await fetch('/api/ForgotPassword', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(forgotPasswordData)
                      });

                      const result = await response.json();
                      if (result.error) {
                          document.getElementById('forgotErrorMessage').innerText = result.error;
                          return false;
                      } else {
                          Swal.fire('Success!', 'Password reset instructions sent to your email.', 'success');
                      }
                  } catch (error) {
                      document.getElementById('forgotErrorMessage').innerText = 'Request failed. Please try again.';
                      return false;
                  }
              }
          });
        });

        document.getElementById('registerLink').addEventListener('click', function () {
            const showSignUpModal = (errorMessage = '') => {
                Swal.fire({
                    title: 'Sign Up',
                    width: '700px',
                    imageUrl: '/images/LOGO.png', // Replace with your logo path
                    imageWidth: 140, // Adjust as needed
                    imageHeight: 100, // Adjust as needed
                    html: `
                        <div class="row" style="text-align:left">
                            <div class="col-12 col-md-6">
                                <div class="input-group mb-3">
                                    <span class="input-group-text"><i class="fa fa-user"></i></span>
                                    <input type="text" id="fname" name="fname" class="form-control" required autocomplete="off" placeholder="">
                                    <label for="fname" class="floating-label">First Name</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="input-group mb-3">
                                    <span class="input-group-text"><i class="fa fa-user"></i></span>
                                    <input type="text" id="lname" name="lname" class="form-control" required autocomplete="off" placeholder="">
                                    <label for="lname" class="floating-label">Last Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="text-align:left">
                            <div class="col-12 col-md-6">
                              <div class="input-group mb-3">
                                <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                                <input type="email" id="email" class="form-control" placeholder=" " required autocomplete="off">
                                <label for="email" class="floating-label">Email</label>
                              </div>
                            </div>

                            <div class="col-12 col-md-6 position-relative">
                                <div class="input-group mb-3">
                                    <select id="usertype" name="usertype" class="form-control" required>
                                        <option value="" disabled selected hidden>Select User Type</option>
                                        <option value="Non-FAST Employee">Non-FAST Employee</option>
                                        <option value="FAST Employee">FAST Employee</option>
                                    </select>
                                    <label for="usertype" class="floating-label">User Type</label>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="text-align:left">
                          <div class="col-12 col-md-6">
                            <div class="input-group mb-3">
                              <span class="input-group-text"><i class="fa fa-lock"></i></span>
                              <input type="password" id="newPassword" class="form-control" placeholder=" " required>
                              <span class="input-group-text" id="togglePasswordNew" style="cursor: pointer;">
                                <i class="fa fa-eye"></i>
                              </span>
                              <label for="newPassword" class="floating-label">Password</label>
                            </div>
                          </div>

                          <div class="col-12 col-md-6">
                            <div class="input-group mb-3">
                              <span class="input-group-text"><i class="fa fa-lock"></i></span>
                              <input type="password" id="confirmPassword" class="form-control" placeholder=" " required>
                              <span class="input-group-text" id="togglePasswordConfirm" style="cursor: pointer;">
                                <i class="fa fa-eye"></i>
                              </span>
                              <label for="confirmPassword" class="floating-label">Confirm Password</label>
                            </div>
                          </div>
                        </div>
                        <div id="SBUContainer" style="display: none;" style="text-align:left">
                          <div class="row">
                              <div class="col-12 col-md-6">
                                  <label for="SBU" class="form-label">SBU</label>
                                  <select id="SBU" class="form-control mb-3">
                                      <option value="FSC">FSC</option>
                                      <option value="FLC">FLC</option>
                                      <option value="FTMC">FTMC</option>
                                      <option value="FCSI">FCSI</option>
                                      <option value="FDC">FDC</option>
                                      <option value="FUI">FUI</option>
                                  </select>
                              </div>
                              <div class="col-12 col-md-6">
                                  <label for="branch" class="form-label">Branch</label>
                                  <select id="branchSelect" class="form-control mb-3">
                                  </select>
                              </div>
                          </div>
                        </div>
                        <div id="errorMessage" class="text-danger mt-3">${errorMessage}</div>
                        <div id="recaptcha-container" class="mt-3" style="display: flex; justify-content: center; align-items: center;"></div>
                    `,

                    showCancelButton: true,
                    confirmButtonText: 'Register',
                    cancelButtonText: 'Cancel',
                    didOpen: () => {
                        grecaptcha.render('recaptcha-container', {
                            sitekey: '6LcEwdUqAAAAAFnSG67vpecp_r_Ow1TWd25DDKCX'
                        });

                        document.getElementById('togglePasswordNew').addEventListener('click', function () {
                          const passwordField = document.getElementById('newPassword');
                          const eyeIcon = this.querySelector('i');
    
                          if (passwordField.type === "password") {
                              passwordField.type = "text";
                              eyeIcon.classList.remove("fa-eye");
                              eyeIcon.classList.add("fa-eye-slash");
                          } else {
                              passwordField.type = "password";
                              eyeIcon.classList.remove("fa-eye-slash");
                              eyeIcon.classList.add("fa-eye");
                          }
                        });
                        document.getElementById('togglePasswordConfirm').addEventListener('click', function () {
                          const passwordField = document.getElementById('confirmPassword');
                          const eyeIcon = this.querySelector('i');
    
                          if (passwordField.type === "password") {
                              passwordField.type = "text";
                              eyeIcon.classList.remove("fa-eye");
                              eyeIcon.classList.add("fa-eye-slash");
                          } else {
                              passwordField.type = "password";
                              eyeIcon.classList.remove("fa-eye-slash");
                              eyeIcon.classList.add("fa-eye");
                          }
                        });
                    },
                    preConfirm: async () => {
                        const fname = document.getElementById('fname').value.trim();
                        const lname = document.getElementById('lname').value.trim();
                        const email = document.getElementById('email').value.trim();
                        const password = document.getElementById('newPassword').value.trim();
                        const confirmPassword = document.getElementById('confirmPassword').value.trim();
                        const userType = document.getElementById('usertype').value;
                        const sbu = document.getElementById('SBU') ? document.getElementById('SBU').value : null;
                        const branch = document.getElementById('branchSelect') ? document.getElementById('branchSelect').value : null;
                        const recaptchaResponse = grecaptcha.getResponse();
                        if (!recaptchaResponse) {
                            document.getElementById('errorMessage').innerText = 'Please verify the reCAPTCHA.';
                            return false;
                        }

                        // Enhanced validation
                        if (!fname || !lname || !email || !password || !confirmPassword) {
                            document.getElementById('errorMessage').innerText = 'All fields are required.';
                            return false;
                        }
        
                        if (password !== confirmPassword) {
                            document.getElementById('errorMessage').innerText = 'Passwords do not match.';
                            return false;
                        }
        
                        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                        if (!emailRegex.test(email)) {
                            document.getElementById('errorMessage').innerText = 'Please enter a valid email address.';
                            return false;
                        }
        
                        try {
                            const registrationData = {
                                fname,
                                lname,
                                email,
                                password,
                                confirmPassword,
                                userType,
                                sbu,
                                branch,
                                recaptchaResponse 
                            };
        
                            const response = await fetch('/api/UserRegistration', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(registrationData)
                            });
        
                            const result = await response.json();
        
                            if (result.error) {
                                document.getElementById('errorMessage').innerText = result.error;
                                return false;
                            } else {
                                Swal.fire('Success!', 'Registration completed.', 'success');
                                window.location.reload();
                            }
                        } catch (error) {
                            document.getElementById('errorMessage').innerText = 'Registration failed. Please try again.';
                            return false;
                        }
                    }
                });
                
                    const branchSelect = document.getElementById('branchSelect');
                    branchSelect.innerHTML = ''; // Clear previous options
                    branches.forEach((branch) => {
                        const option = document.createElement('option');
                        option.value = branch;
                        option.textContent = branch;
                        branchSelect.appendChild(option);
                    });
        
                    // Show/Hide SBU Based on User Type
                    const userTypeSelect = document.getElementById('usertype');
                    const sbuContainer = document.getElementById('SBUContainer');
                    userTypeSelect.addEventListener('change', function () {
                        sbuContainer.style.display = userTypeSelect.value === 'FAST Employee' ? 'block' : 'none';
                    });
                
            };
        
            showSignUpModal();
        });
        

        });
    } else {
        console.error("Element with ID 'LoginModal' not found.");
    }
    const logoutButton = document.getElementById('LogoutButton');
    
    if (logoutButton) {
      logoutButton.addEventListener('click', function () {
        // Confirm the logout action with the user
        Swal.fire({
          title: 'Are you sure?',
          text: 'You will be logged out of your account.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, log out',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            // Perform the logout action (e.g., API call, session clear)
            fetch('/api/logout', {
              method: 'POST',
            })
              .then((response) => {
                if (response.ok) {
                  Swal.fire('Logged Out', 'You have been successfully logged out.', 'success').then(() => {
                    window.location.reload(); // Redirect to login page
                  });
                } else {
                  Swal.fire('Error', 'Logout failed. Please try again.', 'error');
                }
              })
              .catch((error) => {
                Swal.fire('Error', 'An unexpected error occurred.', 'error');
                console.error('Logout error:', error);
              });
          }
        });
      });
    } else {
      console.warn('Logout button not found');
    }
});

function checkUserStatus() {
    fetch('/api/validate-cookie') // API endpoint to validate the cookie
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error('User is not logged in.');
            }
        })
        .then(function(userData) {
            if (userData) {

                // Hide the "Login" link
                const loginItem = document.getElementById('loginItem');
                if (loginItem) {
                    loginItem.style.display = 'none';
                }

                const BookNow = document.getElementById('BookNow');
                if (BookNow) {
                    BookNow.style.display = 'block';
                }

                const LogoutDropdown = document.getElementById('LogoutDropdown');
                if (LogoutDropdown) {
                    LogoutDropdown.style.display = 'block';
                }
            }
        })
        .catch(function(error) {
            console.error('Error checking user status:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  const token = urlParams.get("token");

  if (urlParams.get("reset") === "true" && email) {
    const showChangePasswordModal = (errorMessage = '') => {
      Swal.fire({
        title: "Reset Password",
        imageUrl: '/images/LOGO.png', // Replace with your logo path
        imageWidth: 140, // Adjust as needed
        imageHeight: 100, // Adjust as needed
        html: `
          <div>
            <p style="font-size: 16px;">Reset password for: <strong>${email}</strong></p>
            <div style="text-align:left">
              <label for="newPassword" class="form-label">New Password</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fa fa-lock"></i></span>
                  <input type="password" id="newPassword" class="form-control" placeholder="Enter your new password">
                  <span class="input-group-text" id="togglePassword" style="cursor: pointer;">
                    <i class="fa fa-eye"></i>
                  </span>
              </div>
            </div>
          </div>
          <div id="errorMessage" class="text-danger mt-3">${errorMessage}</div>
        `,
        showCancelButton: true,
        confirmButtonText: "Change Password",
        didOpen: () => {
            // Password toggle logic
            document.getElementById('togglePassword').addEventListener('click', function () {
              const passwordField = document.getElementById('newPassword');
              const eyeIcon = this.querySelector('i');

              if (passwordField.type === "password") {
                  passwordField.type = "text";
                  eyeIcon.classList.remove("fa-eye");
                  eyeIcon.classList.add("fa-eye-slash");
              } else {
                  passwordField.type = "password";
                  eyeIcon.classList.remove("fa-eye-slash");
                  eyeIcon.classList.add("fa-eye");
              }
            });
        },
        preConfirm: async () => {
          const newPassword = document.getElementById("newPassword").value.trim();

          if (!newPassword) {
            document.getElementById("errorMessage").innerText = "Password cannot be empty.";
            return false;
          }

          try {
            const response = await fetch("/api/ForgotPassword", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, token, newPassword }),
            });

            const result = await response.json();

            if (result.error) {
              document.getElementById("errorMessage").innerText = result.error;
              return false;
            } else {
              Swal.fire({
                title: "Success!",
                text: "Your password has been changed.",
                icon: "success"
              }).then(() => {
                window.location.href = "/";
              });
            }
          } catch (error) {
            document.getElementById("errorMessage").innerText = "Something went wrong. Please try again.";
            return false;
          }
        },
      });
    };

    showChangePasswordModal();
  }
});


  
  






  


