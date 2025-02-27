import { branches } from "/js/branches.js";

document.addEventListener("DOMContentLoaded", function () {
  // Toggle password visibility
  function togglePasswordVisibility(toggleId, inputId) {
    document
      .getElementById(toggleId)
      .addEventListener("click", function () {
        const passwordField = document.getElementById(inputId);
        const eyeIcon = this.querySelector("i");

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
  }

  togglePasswordVisibility("togglePasswordNew", "newPassword");
  togglePasswordVisibility("togglePasswordConfirm", "confirmPassword");

  // Populate Branch select options
  const branchSelect = document.getElementById("branchSelect");
  if (branchSelect) {
    branchSelect.innerHTML = ""; // Clear previous options

    // Add default placeholder option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    defaultOption.textContent = "Branch";
    branchSelect.appendChild(defaultOption);

    // Append dynamic branch options
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

    if (userTypeField.value === "FAST Employee") {
      sbuDiv.style.display = "block";
      branchDiv.style.display = "block";
    } else {
      sbuDiv.style.display = "none";
      branchDiv.style.display = "none";
    }
  }

  // Event listener for User Type change
  document
    .getElementById("usertype")
    .addEventListener("change", toggleSBUAndBranch);

  // Fetch user data
  fetch("/api/validate-cookie")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("User is not logged in.");
      }
      return response.json();
    })
    .then(function (userData) {
      if (!userData) return;

      document.getElementById("user_id").value = userData.userId || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("fname").value = userData.firstName || "";
      document.getElementById("lname").value = userData.lastName || "";
      document.getElementById("usertype").value = userData.usertype || "";

      // Set SBU selection
      let sbuSelect = document.getElementById("SBU");
      if (sbuSelect) {
        for (let i = 0; i < sbuSelect.options.length; i++) {
          if (sbuSelect.options[i].value === userData.sbu) {
            sbuSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Set Branch selection
      let branchSelect = document.getElementById("branchSelect");
      if (branchSelect) {
        for (let i = 0; i < branchSelect.options.length; i++) {
          if (branchSelect.options[i].value === userData.branch) {
            branchSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Ensure the correct visibility of SBU and Branch
      toggleSBUAndBranch();
    })
    .catch(function (error) {
      console.error("Error fetching user data:", error);
    });
});