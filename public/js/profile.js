// import { branches } from "/js/branches.js";

// document.addEventListener("DOMContentLoaded", function () {
//   // Toggle password visibility
//   function togglePasswordVisibility(toggleId, inputId) {
//     document
//       .getElementById(toggleId)
//       .addEventListener("click", function () {
//         const passwordField = document.getElementById(inputId);
//         const eyeIcon = this.querySelector("i");

//         if (passwordField.type === "password") {
//           passwordField.type = "text";
//           eyeIcon.classList.remove("fa-eye");
//           eyeIcon.classList.add("fa-eye-slash");
//         } else {
//           passwordField.type = "password";
//           eyeIcon.classList.remove("fa-eye-slash");
//           eyeIcon.classList.add("fa-eye");
//         }
//       });
//   }

//   togglePasswordVisibility("togglePasswordNew", "newPassword");
//   togglePasswordVisibility("togglePasswordConfirm", "confirmPassword");

//   // Populate Branch select options
//   const branchSelect = document.getElementById("branchSelect");
//   if (branchSelect) {
//     branchSelect.innerHTML = ""; // Clear previous options

//     // Add default placeholder option
//     const defaultOption = document.createElement("option");
//     defaultOption.value = "";
//     defaultOption.disabled = true;
//     defaultOption.selected = true;
//     defaultOption.hidden = true;
//     defaultOption.textContent = "Branch";
//     branchSelect.appendChild(defaultOption);

//     // Append dynamic branch options
//     branches.forEach((branch) => {
//       const option = document.createElement("option");
//       option.value = branch;
//       option.textContent = branch;
//       branchSelect.appendChild(option);
//     });
//   }

//   // Function to toggle SBU & Branch visibility
//   function toggleSBUAndBranch() {
//     const userTypeField = document.getElementById("usertype");
//     const sbuDiv = document.getElementById("div-SBU");
//     const branchDiv = document.getElementById("div-Branch");

//     if (userTypeField.value === "FAST Employee") {
//       sbuDiv.style.display = "block";
//       branchDiv.style.display = "block";
//     } else {
//       sbuDiv.style.display = "none";
//       branchDiv.style.display = "none";
//     }
//   }

//   // Event listener for User Type change
//   document.getElementById("usertype").addEventListener("change", toggleSBUAndBranch);

//   // Fetch user data
//   fetch("/api/validate-cookie")
//     .then(function (response) {
//       if (!response.ok) {
//         throw new Error("User is not logged in.");
//       }
//       return response.json();
//     })
//     .then(function (userData) {
//       if (!userData) return;

//       document.getElementById("user_id").value = userData.userId || "";
//       document.getElementById("email").value = userData.email || "";
//       document.getElementById("fname").value = userData.firstName || "";
//       document.getElementById("lname").value = userData.lastName || "";
//       document.getElementById("usertype").value = userData.usertype || "";

//       // Set SBU selection
//       let sbuSelect = document.getElementById("SBU");
//       if (sbuSelect) {
//         for (let i = 0; i < sbuSelect.options.length; i++) {
//           if (sbuSelect.options[i].value === userData.sbu) {
//             sbuSelect.selectedIndex = i;
//             break;
//           }
//         }
//       }

//       // Set Branch selection
//       let branchSelect = document.getElementById("branchSelect");
//       if (branchSelect) {
//         for (let i = 0; i < branchSelect.options.length; i++) {
//           if (branchSelect.options[i].value === userData.branch) {
//             branchSelect.selectedIndex = i;
//             break;
//           }
//         }
//       }

//       // Ensure the correct visibility of SBU and Branch
//       toggleSBUAndBranch();
//     })
//     .catch(function (error) {
//       console.error("Error fetching user data:", error);
//     });

//     // Handle button click to update user details
//   document.getElementById("update_UserDetails").addEventListener("click", function () {
//     const usertype = document.getElementById("usertype").value;

//     // Get input values
//     const userUpdateData = {
//         user_id: document.getElementById("user_id").value,
//         fname: document.getElementById("fname").value,
//         lname: document.getElementById("lname").value,
//         userType: usertype,
//         email: document.getElementById("email").value,
//         sbu: document.getElementById("SBU").value,
//         branch: document.getElementById("branchSelect").value
//     };

//           // If user is Guest, clear SBU and Branch
//           if (usertype === "Guest") {
//             userUpdateData.sbu = null;
//             userUpdateData.branch = null;
//         }

//     // Confirmation alert before sending data
//     Swal.fire({
//       title: "Confirm Update",
//       text: "Are you sure you want to update your profile details?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes, update",
//       cancelButtonText: "Cancel"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Send data to server
//         fetch("/api/UserAuth", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(userUpdateData)
//         })
//             .then(response => response.json())
//             .then(data => {
//             if (data.message === "Successfully Updated.") {
//                 Swal.fire("Updated!", "Your profile has been updated.", "success");
//             } else {
//                 Swal.fire("Error!", data.error || "Something went wrong. Try again.", "error");
//             }
//             })
//             .catch(error => {
//                 console.error("Error:", error);
//                 Swal.fire("Error!", "An error occurred. Please try again.", "error");
//             });
//       }
//     });
//   });


// });

import { branches } from "/js/branches.js";

document.addEventListener("DOMContentLoaded", function () {
  // Toggle password visibility
  function togglePasswordVisibility(toggleId, inputId) {
    const toggleButton = document.getElementById(toggleId);
    const passwordField = document.getElementById(inputId);

    if (toggleButton && passwordField) {
      toggleButton.addEventListener("click", function () {
        const eyeIcon = this.querySelector("i");

        if (passwordField.type === "password") {
          passwordField.type = "text";
          eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
          passwordField.type = "password";
          eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
        }
      });
    }
  }

  togglePasswordVisibility("togglePasswordNew", "newPassword");
  togglePasswordVisibility("togglePasswordConfirm", "confirmPassword");

  // Populate Branch select options
  const branchSelect = document.getElementById("branchSelect");
  if (branchSelect) {
    branchSelect.innerHTML = ""; // Clear previous options

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    defaultOption.textContent = "Branch";
    branchSelect.appendChild(defaultOption);

    branches.forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch;
      option.textContent = branch;
      branchSelect.appendChild(option);
    });
  }

  // Function to toggle SBU & Branch visibility
  function toggleSBUAndBranch() {
    const userTypeField = document.getElementById("usertype");
    const sbuDiv = document.getElementById("div-SBU");
    const branchDiv = document.getElementById("div-Branch");

    if (userTypeField && sbuDiv && branchDiv) {
      if (userTypeField.value === "FAST Employee") {
        sbuDiv.style.display = "block";
        branchDiv.style.display = "block";
      } else {
        sbuDiv.style.display = "none";
        branchDiv.style.display = "none";
      }
    }
  }

  const userTypeField = document.getElementById("usertype");
  if (userTypeField) {
    userTypeField.addEventListener("change", toggleSBUAndBranch);
  }

  // Fetch user data
  fetch("/api/validate-cookie")
    .then((response) => {
      if (!response.ok) {
        throw new Error("User is not logged in.");
      }
      return response.json();
    })
    .then((userData) => {
      if (!userData) return;

      document.getElementById("user_id").value = userData.userId || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("fname").value = userData.firstName || "";
      document.getElementById("lname").value = userData.lastName || "";
      document.getElementById("usertype").value = userData.usertype || "";

      const sbuSelect = document.getElementById("SBU");
      if (sbuSelect) {
        sbuSelect.value = userData.sbu || "";
      }

      if (branchSelect) {
        branchSelect.value = userData.branch || "";
      }

      toggleSBUAndBranch(); // Ensure visibility updates
    })
    .catch((error) => console.error("Error fetching user data:", error));

  // Handle button click to update user details
  const updateButton = document.getElementById("update_UserDetails");
  if (updateButton) {
    updateButton.addEventListener("click", function () {
      const usertype = document.getElementById("usertype").value;

      const userUpdateData = {
        user_id: document.getElementById("user_id").value,
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        userType: usertype,
        email: document.getElementById("email").value,
        sbu: usertype === "Guest" ? null : document.getElementById("SBU").value,
        branch: usertype === "Guest" ? null : branchSelect.value,
      };

      Swal.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update your profile details?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("/api/UserAuth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userUpdateData),
          })
            .then((response) => response.json())
            .then((data) => {
              Swal.fire(
                data.message === "Successfully Updated." ? "Updated!" : "Error!",
                data.message || "Something went wrong.",
                data.message === "Successfully Updated." ? "success" : "error"
              );
            })
            .catch((error) => {
              console.error("Error:", error);
              Swal.fire("Error!", "An error occurred. Please try again.", "error");
            });
        }
      });
    });
  }
});
