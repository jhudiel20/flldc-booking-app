// api/config.js

export default function handler(req, res) {
    // Get environment variables
    const githubOwner = process.env.GITHUB_OWNER;
    const githubImages = process.env.GITHUB_IMAGES;

    // Check if the environment variables are set
    if (!githubOwner || !githubImages) {
        return res.status(500).json({ error: 'Configuration error: Missing environment variables.' });
    }

    // Respond with the configuration data
    res.status(200).json({
        owner: githubOwner,
        repo: githubImages,
    });
}
