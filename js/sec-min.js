// Get the current URL path
const currentPath = window.location.pathname.split('/').pop() || 'index';

// Get all nav-link elements
const navLinks = document.querySelectorAll('.nav-link');

// Iterate through each nav-link and compare its href with the current path
navLinks.forEach(link => {
  // Get the href of the link and remove leading '/'
  const linkHref = link.getAttribute('href').split('/').pop();
  
  // If the href matches the current path, add the 'nav-link-active' class
  if (linkHref === currentPath) {
    link.classList.add('nav-link-active');
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
  includeHTML('nav', 'navigation');
  includeHTML('footer', 'footer');