
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link action

            // Show SweetAlert confirmation dialog
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will be logged out!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, log me out',
                cancelButtonText: 'No, stay logged in',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Function to delete a specific cookie
                    function deleteCookie(name) {
                        document.cookie = name + '=; Max-Age=-99999999; path=/';
                    }

                    // Clear all cookies (you can adjust the names as needed)
                    document.cookie.split(';').forEach(function(cookie) {
                        var cookieName = cookie.split('=')[0].trim();
                        deleteCookie(cookieName);
                    });

                    // Reload the current page after logout
                    window.location.reload(); // This reloads the current page
                }
            });
        });
    } else {
        console.log('Logout button not found');
    }
});