// Google Sign-In API initialization
function init() {
    gapi.load('auth2', function () {
      gapi.auth2.init({
        client_id: '256996938210-31ionlslvrguote7mhd46if0pukld4ea.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
    });
  }
  

 // Google Sign-In API callback function
function onSignIn(googleUser) {
    // Get the user's ID token, used to authenticate backend server
    var id_token = googleUser.getAuthResponse().id_token;
  
    // Get the user's basic profile information
    var profile = googleUser.getBasicProfile();
  
    // Store the user's information in sessionStorage
    sessionStorage.setItem("user_name", profile.getName());
    sessionStorage.setItem("user_image", profile.getImageUrl());
  
    // Redirect the user to the chat application
    window.location.href = "main.html";
  }
  
  
  function signOut() {
    if (sessionStorage.getItem("user_name") === "Guest") {
      // If the user is a guest, clear the sessionStorage and redirect to login page
      sessionStorage.clear();
      window.location.href = "login.html";
    } else {
      // For Google accounts, use the Google API to sign out
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        sessionStorage.clear();
        window.location.href = "login.html";
      });
    }
  }
  
// Add a guest sign-in function
function guestSignIn(event) {
    // Prevent any default behavior
    if (event) event.preventDefault();
  
    // Store guest user information in sessionStorage
    sessionStorage.setItem("user_name", "Guest");
    sessionStorage.setItem("user_image", "https://via.placeholder.com/40");
  
    // Redirect the user to the chat application
    window.location.href = "main.html";
  }
  
  // initialize the Google Sign-In API
  init();
  