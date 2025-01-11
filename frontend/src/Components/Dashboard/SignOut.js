const handleSignOut = () => {
    // Clear the token and userId from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  
    // Redirect to the login page
    window.location.href = '/login'; // Force a full page reload to reset the app state
  };