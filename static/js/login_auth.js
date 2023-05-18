// Function to handle guest sign-in
function guestSignIn(event) {
  console.log('Guest sign-in button clicked');

  // Prevent any default behavior
  if (event) event.preventDefault();

  // Store guest user information in sessionStorage
  sessionStorage.setItem("user_name", "Guest");
  sessionStorage.setItem("user_image", "/Images/default_av.png");

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

// Function to handle user sign-in
function userSignIn(event) {
  console.log('User sign-in button clicked');

  // Prevent any default behavior
  if (event) event.preventDefault();

  // Get the username and password from the form
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Submit a request to the '/login' route
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        // If the server responds with a success status, store the user's
        // information in the session storage and redirect to the main page
        console.log('User sign-in request successful');
        sessionStorage.setItem("user_name", username);
        sessionStorage.setItem("user_image", "Images/default_av.png");
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

  // Send a request to the server to end the session
  fetch('/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Clear the sessionStorage and redirect to login page
      sessionStorage.clear();
      window.location.href = "/login";
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
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
addEventListenerById('guest-signin', 'click', guestSignIn);
addEventListenerById('sign-out', 'click', signOut);
addEventListenerById('user-signin', 'click', userSignIn);