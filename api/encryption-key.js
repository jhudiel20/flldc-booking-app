// api/encryption-key.js
export default function handler(req, res) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
        return res.status(500).json({ error: 'Encryption key not found' });
    }
    res.status(200).json({ key: encryptionKey });
}