# GitHub Integration Setup

This site uses GitHub's API to store form submissions persistently. Follow these steps to set up the integration:

## 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Evinced Screenreader Test Site"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

## 2. Update the Configuration

Edit `config.js` and update these values:

```javascript
window.GITHUB_CONFIG = {
    REPO: 'your-username/your-repo-name', // Replace with your actual repo
    TOKEN: 'your-github-token', // Replace with your actual token
    DATA_FILE: 'submissions.json'
};
```

## 3. Repository Requirements

- The repository must be public or you must have access to it
- The token must have `repo` permissions
- The `submissions.json` file will be created automatically
- The repository should be the same one hosting the GitHub Pages site

## 4. Security Considerations

**Important**: For production use, you should:

### Option A: Environment Variables (Recommended)
- Use GitHub Secrets for the token
- Set up environment variables in your deployment platform
- Never commit tokens to the repository

### Option B: Server-Side Solution
- Create a serverless function (Vercel, Netlify Functions, etc.)
- Handle GitHub API calls server-side
- Keep tokens secure on the server

### Option C: GitHub Actions
- Use GitHub Actions to handle form submissions
- Create a webhook endpoint
- Process submissions through GitHub Actions

## 5. Fallback Behavior

If GitHub API fails, the site will automatically fall back to localStorage, so the site will still work even if GitHub integration fails. You'll see console warnings when this happens.

## 6. Testing

1. Fill out the form and submit
2. Refresh the page - your submission should still be there
3. Check your GitHub repository - you should see a `submissions.json` file
4. The file will be updated each time someone submits or deletes a submission
5. Check the browser console for any error messages

## 7. Troubleshooting

### Common Issues:

1. **"GitHub integration not configured"** - Update `config.js` with your actual values
2. **"Failed to save to GitHub"** - Check your token permissions and repository access
3. **CORS errors** - GitHub API should work from browsers, but check for network issues
4. **Rate limiting** - GitHub has API rate limits, but they're generous for this use case

### Debug Steps:

1. Open browser developer tools
2. Check the Console tab for error messages
3. Check the Network tab to see if API calls are being made
4. Verify your token has the correct permissions
5. Test the GitHub API directly: `https://api.github.com/repos/YOUR-USERNAME/YOUR-REPO/contents/submissions.json`

## 8. Alternative: Serverless Function

For better security, consider using a serverless function:

```javascript
// api/save-submission.js (for Vercel/Netlify)
export default async function handler(req, res) {
    // Handle GitHub API calls server-side
    // Keep token secure
}
```

This approach keeps your GitHub token secure while still providing persistent storage.
