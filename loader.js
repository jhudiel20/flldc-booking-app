// Function to dynamically load a CSS file
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  
  // Function to dynamically load a JS file
  function loadJS(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Ensure scripts are executed in order
    document.body.appendChild(script);
  }
  
  // Base path for sneat folder
  const basePath = 'sneat/assets/';
  
  // Load Fonts
  loadCSS('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');
  loadCSS(basePath + 'vendor/fonts/boxicons.css');
  loadCSS(basePath + 'vendor/fonts/fontawesome.css');
  loadCSS(basePath + 'vendor/fonts/flag-icons.css');
  
  // Load Core CSS
  loadCSS(basePath + 'vendor/css/rtl/core.css');
  loadCSS(basePath + 'vendor/css/rtl/theme-default.css');
  loadCSS(basePath + 'css/demo.css');
  
  // Load Vendors CSS
  loadCSS(basePath + 'vendor/libs/perfect-scrollbar/perfect-scrollbar.css');
  loadCSS(basePath + 'vendor/libs/typeahead-js/typeahead.css');
  loadCSS(basePath + 'vendor/libs/swiper/swiper.css');
  
  // Load Page CSS
  loadCSS(basePath + 'vendor/css/pages/ui-carousel.css');
  
  // Load Helpers and Config JS
  loadJS(basePath + 'vendor/js/helpers.js');
  loadJS(basePath + 'vendor/js/template-customizer.js');
  loadJS(basePath + 'js/config.js');
  
  // Load Vendor JS
  loadJS(basePath + 'vendor/libs/jquery/jquery.js');
  loadJS(basePath + 'vendor/libs/popper/popper.js');
  loadJS(basePath + 'vendor/js/bootstrap.js');
  loadJS(basePath + 'vendor/libs/perfect-scrollbar/perfect-scrollbar.js');
  loadJS(basePath + 'vendor/libs/hammer/hammer.js');
  loadJS(basePath + 'vendor/libs/i18n/i18n.js');
  loadJS(basePath + 'vendor/libs/typeahead-js/typeahead.js');
  loadJS(basePath + 'vendor/js/menu.js');
  loadJS(basePath + 'vendor/libs/swiper/swiper.js');
  
  // Load Main and Page-specific JS
  loadJS(basePath + 'js/main.js');
  loadJS(basePath + 'js/ui-carousel.js');
  