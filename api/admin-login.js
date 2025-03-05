const crypto = require('crypto');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
    if (req.method === "POST") {
        try {
                const { email, password, recaptchaResponse, userType } = req.body;

                if (!email || !password || !recaptchaResponse || !userType) {
                    return res.status(400).json({ error: "Please check the required fields." });
                }
                return await handleAdminLogin(req, res);

        } catch (error) {
            console.error("Error handling user authentication:", error);
            return res.status(500).json({ error: "Server error", details: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
};

function setPassword(text) {
    if (text.trim() !== "") {
        return crypto.createHash('sha1').update(text + SALT).digest('hex');
    }
    return '';
}

const cipherMethod = 'aes-256-cbc';
const encryptionKey = "qwertyuiopasdfghjklzxcvbnm1234567890johnjhudieljoycediannemnbvcxzlkjhgfdsapoiuytrewq0987654321diannejoycejohnjhudiel1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0pp0lo9ki8mju7nhy6bgt5vfr4cde3xsw2zaq1";

// Ensure the encryption key is 32 bytes
const key = crypto.createHash('sha256').update(encryptionKey).digest();

// Function to encrypt data
function encrypt_cookie(data) {
    const iv = crypto.randomBytes(16); // Generate a 16-byte IV
    const cipher = crypto.createCipheriv(cipherMethod, key, iv);

    // Serialize data (like PHP's serialize)
    const serializedData = JSON.stringify(data); 

    let encrypted = cipher.update(serializedData, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Combine IV and encrypted data (Base64 encoding to match PHP)
    return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
}

const handleAdminLogin = async (req, res) => {
    try {
        const { email, password, recaptchaResponse, userType } = req.body;

        const hashedpassword = setPassword(req.body.password);

        if (!email || !password || !userType || !recaptchaResponse) {
            return res.status(400).json({ error: "All fields are required, including reCAPTCHA." });
        }

        // Fetch user from DB
        const userRes = await pool.query("SELECT * FROM user_account WHERE username = $1", [email]);
        const user = userRes.rows[0];

        if (user.email !== email) {
            return res.status(401).json({ error: "Invalid username." });
        }

        if(user.password !== hashedpassword){
            return res.status(401).json({ error: "Invalid password." });
        }

        if (user.approved_status === 1) {
            return res.status(403).json({ error: "The administrator has rejected your registration!" });
        }

        if (user.locked === 3 && user.access !== 'ADMIN') {
            return res.status(403).json({ error: "Your Account is Locked. Please Contact the Administrator." });
        }

        // Prepare cookie data
        const cookieData = {
            status: true,
            ID: user.id,
            ACCESS: user.access,
            USERNAME: user.username,
            DATE_CREATED: user.date_created,
            FNAME: user.fname,
            MNAME: user.mname,
            LNAME: user.lname,
            EXT_NAME: user.ext_name,
            EMAIL: user.email,
            IMAGE: user.image,
            LOCKED: user.locked,
            ADMIN_STATUS: user.admin_status,
            RESERVATION_ACCESS: user.reservation_access
        };

        const encryptedValue = encrypt_cookie(cookieData, encryption_key);

        // **Set cookies securely**
        res.setHeader("Set-Cookie", [
            `secure_data=${encryptedValue}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1800`,
            `Toast-title=Welcome!; Path=/; Max-Age=10`,
            `Toast-message=Login successful!; Path=/; Max-Age=10`
        ]);

        // **Save logs & update user status**
        await pool.query("INSERT INTO logs (USER_ID, ACTION_MADE) VALUES ($1, $2)", [user.id, "Logged in the system."]);
        await pool.query("UPDATE user_account SET status = '1', locked = '0' WHERE id = $1", [user.id]);

        // return res.json({ success: true });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Database error", details: error.message });
    }
};

