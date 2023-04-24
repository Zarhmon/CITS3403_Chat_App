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
    // Get the user's ID token, which you can use to authenticate with your backend server
    var id_token = googleUser.getAuthResponse().id_token;
  
    // Get the user's basic profile information
    var profile = googleUser.getBasicProfile();
  
    // Store the user's information in sessionStorage
    sessionStorage.setItem('user_name', profile.getName());
    sessionStorage.setItem('user_image', profile.getImageUrl());
  
    // Redirect the user to the chat application
    window.location.href = 'main.html';
  }
  
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      // Clear the sessionStorage
      sessionStorage.clear();
  
      // Redirect the user to the login page
      window.location.href = 'login.html';
    });
  }
  
  // Initialize the Google Sign-In API
  init();