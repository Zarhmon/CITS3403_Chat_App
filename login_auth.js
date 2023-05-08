// Function to handle guest sign-in
function guestSignIn(event) {
  // Prevent any default behavior
  if (event) event.preventDefault();

  // Store guest user information in sessionStorage
  sessionStorage.setItem("user_name", "Guest");
  sessionStorage.setItem("user_image", "https://via.placeholder.com/40");

  // Redirect the user to the chat application
  window.location.href = "main.html";
}

// Function to handle sign-out
function signOut() {
  if (sessionStorage.getItem("user_name") === "Guest") {
    // If the user is a guest, clear the sessionStorage and redirect to login page
    sessionStorage.clear();
    window.location.href = "login.html";
  }
}

// Attach event listener to guest sign-in button
document.getElementById("guest-signin").addEventListener("click", guestSignIn);