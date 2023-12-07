type CookieScripts = {
  [key: string]: () => void;
};

const cookieScripts: CookieScripts = {
  loadExampleScript: () => {
    // Implementation of loadExampleScript
  },
  // Add other scripts if needed
};

export default cookieScripts;
