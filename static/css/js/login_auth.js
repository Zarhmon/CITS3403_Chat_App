// Function to handle guest sign-in
function guestSignIn(event) {
  console.log('Guest sign-in button clicked');

  // Prevent any default behavior
  if (event) event.preventDefault();

  // Store guest user information in sessionStorage
  sessionStorage.setItem("user_name", "Guest");
  sessionStorage.setItem("user_image", "https://via.placeholder.com/40");

  // Submit a request to the '/guest_login' route
  fetch('/guest_login', { method: 'POST' })
    .then(response => {
      if (response.ok) {
        // If the server responds with a success status, redirect to the main page
        console.log('Guest sign-in request successful');
        window.location.href = '/main';
      } else {
        console.error('Error:', response.statusText);
      }
    })
    .catch(error => console.error('Error:', error));
}

// Function to handle sign-out
function signOut() {
  console.log('Sign out button clicked');

  if (sessionStorage.getItem("user_name") === "Guest") {
    // If the user is a guest, clear the sessionStorage and redirect to login page
    sessionStorage.clear();
    window.location.href = "/login";
  }
}

// Function to add event listener to an element
function addEventListenerById(elementId, eventType, eventHandler) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener(eventType, eventHandler);
  } else {
    console.error(`Element with ID '${elementId}' not found.`);
  }
}

// Add event listeners
addEventListenerById('guest-sign-in', 'click', guestSignIn);
addEventListenerById('sign-out', 'click', signOut);