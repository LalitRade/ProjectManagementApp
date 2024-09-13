// Define the authService object
const authService = {
    getCurrentUser: () => {
      return JSON.parse(localStorage.getItem('user'));
    },
  
    login: (username, password) => {
      // Dummy authentication for illustration
      const user = {
        username,
        role: username === 'admin' ? 'admin' : 'viewer'
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    },
  
    logout: () => {
      localStorage.removeItem('user');
    }
  };
  
  // Export the object as default
  export default authService;
  