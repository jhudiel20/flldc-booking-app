// public/js/config.js

// Read environment variables from a global variable set in the HTML
const config = {
    githubOwner: window.env.GITHUB_OWNER || 'default-owner', // Fallback to a default value if needed
    githubRepo: window.env.GITHUB_IMAGES || 'default-repo', // Fallback to a default value if needed
};

export default config;
