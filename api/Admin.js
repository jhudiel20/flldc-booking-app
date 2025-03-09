const crypto = require('crypto');
const { Pool } = require("pg");
const setCookie = require('set-cookie-parser');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { email, password, recaptchaResponse, userType } = req.body;

            if (!email || !password || !recaptchaResponse || !userType) {
                return res.status(400).json({ success: false, error: "Please check the required fields." });
            }
            return await handleAdminLogin(req, res);
        } catch (error) {
            console.error("Error handling user authentication:", error);
            return res.status(500).json({ success: false, error: "Server error", details: error.message });
        }
    } else {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
};

const cipherMethod = 'aes-256-cbc';
const encryptionKey = "qwertyuiopasdfghjklzxcvbnm1234567890johnjhudieljoycediannemnbvcxzlkjhgfdsapoiuytrewq0987654321diannejoycejohnjhudiel1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0pp0lo9ki8mju7nhy6bgt5vfr4cde3xsw2zaq1";
const SALT = encryptionKey; // Use the same key as salt

const key = crypto.createHash('sha256').update(encryptionKey).digest();

function encrypt_cookie(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(cipherMethod, key, iv);
    const serializedData = JSON.stringify(data);

    let encrypted = cipher.update(serializedData, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
}

function setPassword(text) {
    if (text.trim() !== "") {
        return crypto.createHash('sha1').update(text + SALT).digest('hex');
    }
    return '';
}

const handleAdminLogin = async (req, res) => {
    try {
        const { email, password, recaptchaResponse, userType } = req.body;

        const hashedpassword = setPassword(password);

        if (!email || !password || !userType || !recaptchaResponse) {
            return res.status(400).json({ success: false, error: "All fields are required, including reCAPTCHA." });
        }

        // Fetch user from DB
        const userRes = await pool.query("SELECT * FROM user_account WHERE username = $1", [email]);
        const user = userRes.rows[0];

        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid username or password." });
        }

        if (user.password !== hashedpassword) {
            return res.status(401).json({ success: false, error: "Invalid username or password." });
        }

        if (user.approved_status === 1) {
            return res.status(403).json({ success: false, error: "The administrator has rejected your registration!" });
        }

        if (user.locked === 3 && user.access !== 'ADMIN') {
            return res.status(403).json({ success: false, error: "Your Account is Locked. Please Contact the Administrator." });
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

        const encryptedValue = encrypt_cookie(cookieData);

      // **Set cookies manually using headers for the admin domain**
        const cookies = [
            `secure_data=${encryptedValue}; Path=/; Domain=flldc-ims.vercel.app; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`,
            `Toast-title=Welcome!; Path=/; Domain=flldc-ims.vercel.app; Max-Age=10`,
            `Toast-message=Login successful!; Path=/; Domain=flldc-ims.vercel.app; Max-Age=10`
        ];

        res.setHeader("Set-Cookie", cookies);


        // Save logs & update user status
        await pool.query("INSERT INTO logs (USER_ID, ACTION_MADE) VALUES ($1, $2)", [user.id, "Logged in the system."]);
        await pool.query("UPDATE user_account SET status = '1', locked = '0' WHERE id = $1", [user.id]);

        return res.status(200).json({ success: true, redirectUrl: "/" });
    } catch (error) {
        console.error("Database Error Details:", error.stack);
        return res.status(500).json({ success: false, error: "Database error", details: error.message });
    }
};
