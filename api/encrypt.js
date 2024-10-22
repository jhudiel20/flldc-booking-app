import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY.padEnd(32, ' '); // 32-byte key
const IV_LENGTH = 16; // AES block size

export function encrypt(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

export default function handler(req, res) {
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_IMAGES;

    if (!githubOwner || !githubRepo) {
        return res.status(500).json({ error: 'Configuration error: Missing environment variables.' });
    }

    const data = JSON.stringify({ owner: githubOwner, repo: githubRepo });
    const encryptedData = encrypt(data);

    // Send encrypted data and key to the client securely
    res.status(200).json({ encryptedData });
}
