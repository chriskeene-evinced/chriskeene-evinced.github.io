// GitHub API Configuration
// IMPORTANT: For security, these should be set as environment variables
// or configured through your deployment platform (GitHub Pages, Netlify, etc.)

window.GITHUB_CONFIG = {
    // Replace with your actual repository (format: username/repository-name)
    REPO: 'your-username/your-repo-name',
    
    // Replace with your GitHub Personal Access Token
    // For GitHub Pages, you can use GitHub Secrets
    TOKEN: 'your-github-token',
    
    // The data file name in your repository
    DATA_FILE: 'submissions.json'
};

// Alternative: Use environment variables (recommended for production)
// window.GITHUB_CONFIG = {
//     REPO: process.env.GITHUB_REPO || 'your-username/your-repo-name',
//     TOKEN: process.env.GITHUB_TOKEN || 'your-github-token',
//     DATA_FILE: 'submissions.json'
// };
