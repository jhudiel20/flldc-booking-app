import { encrypt, decrypt } from './encrypt.js';

export default function handler(req, res) {
    try {
        const githubOwner = process.env.GITHUB_OWNER;
        const githubImages = process.env.GITHUB_IMAGES;

        if (!githubOwner || !githubImages) {
            return res.status(500).json({ error: 'Missing environment variables.' });
        }

        const data = JSON.stringify({ owner: githubOwner, repo: githubImages });
        const encryptedData = encrypt(data);

        console.log('Encrypted Data:', encryptedData); // For debugging

        res.status(200).json({ encryptedData });
    } catch (error) {
        console.error('Encryption Error:', error);
        res.status(500).json({ error: 'Encryption failed' });
    }
}
