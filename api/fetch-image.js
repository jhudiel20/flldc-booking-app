import { encrypt, decrypt } from './encrypt.js';

export default function handler(req, res) {
    // Get environment variables
    const githubOwner = process.env.GITHUB_OWNER;
    const githubImages = process.env.GITHUB_IMAGES;

    if (!githubOwner || !githubImages) {
        return res.status(500).json({ error: 'Configuration error: Missing environment variables.' });
    }

    // Encrypt the data before responding (for demonstration purposes)
    const data = JSON.stringify({ owner: githubOwner, repo: githubImages });
    const encryptedData = encrypt(data);

    console.log('Encrypted Data:', encryptedData); // For testing purposes

    // Optionally decrypt to verify the encryption
    const decryptedData = decrypt(encryptedData);
    console.log('Decrypted Data:', decryptedData); // For testing purposes

    // Send the decrypted data to the client
    res.status(200).json(JSON.parse(decryptedData)); 
}
