type CookieScripts = {
  [key: string]: () => void; // Assuming the functions have a void return type
};

const cookieScripts: CookieScripts = {
  loadExampleScript: () => {
    // Implementation of loadExampleScript
  },
  // Add other scripts if needed
};

export default cookieScripts;
