// const crypto = require('crypto');
// const { Pool } = require("pg");
// const cookie = require('cookie');
// const bcrypt = require('bcrypt');

// const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
// });

// const SALT = "qwertyuiopasdfghjklzxcvbnm1234567890johnjhudieljoycediannemnbvcxzlkjhgfdsapoiuytrewq0987654321diannejoycejohnjhudiel1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0pp0lo9ki8mju7nhy6bgt5vfr4cde3xsw2zaq1"; // Replace with your actual salt
// const cipherMethod = 'aes-256-cbc';

// const encryption_key = 'qwertyuiopasdfghjklzxcvbnm1234567890johnjhudieljoycediannemnbvcxzlkjhgfdsapoiuytrewq0987654321diannejoycejohnjhudiel1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0pp0lo9ki8mju7nhy6bgt5vfr4cde3xsw2zaq1'; // Use a strong key



// module.exports = async (req, res) => {
//     try {
//         if (req.method === "POST") {
//             const { email, password, recaptchaResponse, userType } = req.body;

//             if (!email || !password || !recaptchaResponse || !userType) {
//                 return res.status(400).json({ error: "Please check the required fields." });
//             }

//             return await handleAdminLogin(req, res);
//         } else {
//             return res.status(405).json({ error: "Method Not Allowed" });
//         }
//     } catch (error) {
//         console.error("Error handling user authentication:", error);
//         return res.status(500).json({ error: "Server error", details: error.message });
//     }
// };

// function set_password(text) {
//     if (text.trim() !== "") {
//         return crypto.createHash('sha1').update(text + SALT).digest('hex');
//     }
//     return '';
// }

// function encrypt_cookie(data, key, cipherMethod) {
//     const iv = crypto.randomBytes(16); // Use a 16-byte IV for AES-256-CBC
//     const cipher = crypto.createCipheriv(cipherMethod, Buffer.from(key, 'utf8'), iv);

//     let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
//     encrypted += cipher.final('base64');

//     return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
// }

// const handleAdminLogin = async (req, res) => {
//     try {
//         const { email, password, recaptchaResponse, userType } = req.body;

//         if (!email || !password || !userType || !recaptchaResponse) {
//             return res.status(400).json({ error: "All fields are required, including reCAPTCHA." });
//         }

//         const hashedPassword = set_password(password);
//         const userRes = await pool.query("SELECT * FROM user_account WHERE username = $1", [email]);
//         const user = userRes.rows[0];

//         if (!user) {
//             return res.status(401).json({ error: "Invalid username or password." });
//         }

//         const checkRes = await pool.query(
//             "SELECT * FROM user_account WHERE username = $1 AND password = $2 AND approved_status = 2 AND locked = 3 AND access != 'ADMIN'", 
//             [email, hashedPassword]
//         );

//         if (checkRes.rowCount > 0) {
//             return res.status(403).json({ error: "Your Account is Locked. Please Contact the Administrator." });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ error: "Wrong Password!" });
//         }

//         if (user.approved_status === 1) {
//             return res.status(403).json({ error: "The administrator has rejected your registration!" });
//         }

//         const cookieData = {
//             status: true,
//             ID: user.id,
//             ACCESS: user.access,
//             USERNAME: user.username,
//             DATE_CREATED: user.date_created,
//             FNAME: user.fname,
//             MNAME: user.mname,
//             LNAME: user.lname,
//             EXT_NAME: user.ext_name,
//             EMAIL: user.email,
//             IMAGE: user.image,
//             LOCKED: user.locked,
//             ADMIN_STATUS: user.admin_status,
//             RESERVATION_ACCESS: user.reservation_access
//         };

//         const encryptedValue = encrypt_cookie(cookieData, encryption_key, 'aes-256-cbc');

//         // **Set cookies in the response**
//         res.setHeader("Set-Cookie", [
//             `secure_data=${encryptedValue}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1800`,
//             `Toast-title=Welcome!; Path=/; Max-Age=10`,
//             `Toast-message=Login successful!; Path=/; Max-Age=10`
//         ]);

//         // **Save logs & update user status**
//         await pool.query("INSERT INTO logs (USER_ID, ACTION_MADE) VALUES ($1, $2)", [user.id, "Logged in the system."]);
//         await pool.query("UPDATE user_account SET status = '1', locked = '0' WHERE id = $1", [user.id]);

//         return res.json({ success: true });
//     } catch (error) {
//         console.error("Login Error:", error);
//         return res.status(500).json({ error: "Database error", details: error.message });
//     }
// };

const crypto = require('crypto');
const { Pool } = require("pg");
const cookie = require('cookie');
const bcrypt = require('bcrypt');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// Ensure a 32-byte encryption key for AES-256-CBC
const encryption_key = crypto.createHash('sha256').update(
    "qwertyuiopasdfghjklzxcvbnm1234567890johnjhudieljoycediannemnbvcxzlkjhgfdsapoiuytrewq0987654321diannejoycejohnjhudiel1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0pp0lo9ki8mju7nhy6bgt5vfr4cde3xsw2zaq1"
).digest('base64').substr(0, 32);

const cipherMethod = 'aes-256-cbc';

module.exports = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { email, password, recaptchaResponse, userType } = req.body;

        if (!email || !password || !recaptchaResponse || !userType) {
            return res.status(400).json({ error: "Please check the required fields." });
        }

        return await handleAdminLogin(req, res);
    } catch (error) {
        console.error("Error handling user authentication:", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};

function encrypt_cookie(data, key) {
    const iv = crypto.randomBytes(16); // 16-byte IV for AES-256-CBC
    const cipher = crypto.createCipheriv(cipherMethod, Buffer.from(key, 'utf8'), iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return `${iv.toString('hex')}:${encrypted}`;
}

const handleAdminLogin = async (req, res) => {
    try {
        const { email, password, recaptchaResponse, userType } = req.body;

        if (!email || !password || !userType || !recaptchaResponse) {
            return res.status(400).json({ error: "All fields are required, including reCAPTCHA." });
        }

        // Fetch user from DB
        const userRes = await pool.query("SELECT * FROM user_account WHERE username = $1", [email]);
        const user = userRes.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // Check if the account is locked or restricted
        const checkRes = await pool.query(
            "SELECT * FROM user_account WHERE username = $1 AND password = $2 AND approved_status = 2 AND locked = 3 AND access != 'ADMIN'", 
            [email, user.password] // Password already stored in DB as bcrypt hash
        );

        if (checkRes.rowCount > 0) {
            return res.status(403).json({ error: "Your Account is Locked. Please Contact the Administrator." });
        }

        // Compare bcrypt-hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Wrong Password!" });
        }

        if (user.approved_status === 1) {
            return res.status(403).json({ error: "The administrator has rejected your registration!" });
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

        return res.json({ success: true });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Database error", details: error.message });
    }
};

