const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const path = require('path');

const logoPath = path.join(__dirname, '../public/images/LOGO.png');
// PostgreSQL connection using connection string from environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// Function to generate a unique booking ID
function generateBookingId() {
  // Get the current date
  const date = new Date();
  
  // Format the date as MMDDYYYY
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  // Create a random unique number (you can adjust the length if needed)
  const uniquePart = Math.floor(Math.random() * 1000000); // Generates a number between 0 and 999999

  // Combine them into the desired format MMDDYYYY-unique
  return `${month}${day}${year}-${uniquePart}`;
}

// Function to validate form input
const validateInput = (data) => {
  const { roomName, reserve_date, time, setup, businessunit, roomID, guest, contact, email } = data;
  const errors = [];

  if (!reserve_date) errors.push('Reservation date is required.');
  if (!time) errors.push('Reservation time is required.');
  if (!businessunit) errors.push('Business unit is required.');
  if (!guest) errors.push('Guest is required.');
  if (!roomID) errors.push('Room is required.');
  if (!setup) errors.push('Seating arrangement is required.');
  if (!contact) errors.push('Contact number is required.');
  if (!email) {
    errors.push('Email is required.');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email format is invalid.');
  }

  return errors;
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { fname, lname, roomPrices, reserve_date, time, businessunit, roomID, roomName, setup, guest, contact, email, table, chair, hdmi, extension, message } = req.body;

    // Validate input
    const errors = validateInput(req.body);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return res.status(400).json({ errors }); // Send validation errors to the front-end
    }

    // Validate email before sending
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const booking_id = generateBookingId();

    // Create the transporter for sending email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const AdminNotif = {
      from: process.env.EMAIL_USER,
      to: [process.env.EMAIL_USER, 'jppsolis@fast.com.ph'], // Use process.env.EMAIL_USER for recipient
      subject: `New Booking Inserted - Booking ID: ${booking_id}`,
      html: `
        <div style="background:#f3f3f3">
          <div style="margin:0px auto;max-width:640px;background:transparent">
            <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
              <tbody>
                <tr>
                  <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px">
                    <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px" align="center" border="0">
                                <tbody>
                                  <tr>
                                    <td style="width:138px">
                                      <img alt="" title="" height="100px" width="200px" src="cid:logo_cid" style="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden">
            <div style="margin:0px auto;max-width:640px;background:#fdfdfd">
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fdfdfd" align="center" border="0">
                <tbody>
                  <tr>
                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px">
                      <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
                                <div style="color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left">
                                  <h2 style="font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">Hi good day,</h2>
                                  <p>A new booking has been submitted: </p>
                                  <p><b>Booking ID:</b> ${booking_id}<br>
                                  <b>Booking Date:</b> ${reserve_date}<br>
                                  <b>₱ </b> ${roomPrices}<br>
                                  <b>Business Unit:</b> ${businessunit}<br>
                                  <b>Room:</b> ${roomName}<br>
                                  <b>Contact:</b> ${contact}<br>
                                  <b>Email:</b> ${email}<br>
                                  <b>Time:</b> ${time}<br>
                                  <b>Setup:</b> ${setup}<br>
                                  <b>Reserved By:</b> ${fname} ${lname}<br>
                                  ${table ? `<b>Additional Tables:</b> ${table}<br>` : ''}
                                  ${chair ? `<b>Additional Chairs:</b> ${chair}<br>` : ''}
                                  ${extension ? `<b>Extension Cord:</b> ${extension}<br>` : ''}
                                  ${hdmi ? `<b>HDMI Cable:</b> ${hdmi}<br>` : ''}
                                  <p> Please click the link below to Approved or Declined the booking :</p>
                                  <a href="https://flldc-ims.vercel.app/reservation-list">Approved / Declined<a>
                                  <p>Best Regards,<br>L&D Inventory Management System</p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style="word-break:break-word;font-size:0px;padding:30px 0px">
                                <p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table align="center">
                <tr>
                  <td style="height:150px; border:none;border-radius:3px;color:black;padding:15px 19px" align="center" valign="middle">&copy; 2024-2025 <strong><span>FAST Learning and Development Center</span></strong></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'LOGO.png',
          path: logoPath, // Path to the logo image
          cid: 'logo_cid' // The 'cid' should match the embedded image's "src"
        }
      ]
    };
    const ClientNotif = {
      from: process.env.EMAIL_USER,
      to: email, // Use process.env.EMAIL_USER for recipient
      subject: `Booking Submitted - Booking ID: ${booking_id}`,
      html: `
        <div style="background:#f3f3f3">
          <div style="margin:0px auto;max-width:640px;background:transparent">
            <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
              <tbody>
                <tr>
                  <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px">
                    <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px" align="center" border="0">
                                <tbody>
                                  <tr>
                                    <td style="width:138px">
                                      <img alt="" title="" height="100px" width="200px" src="cid:logo_cid" style="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden">
            <div style="margin:0px auto;max-width:640px;background:#fdfdfd">
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fdfdfd" align="center" border="0">
                <tbody>
                  <tr>
                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px">
                      <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
                                <div style="color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left">
                                  <h2 style="font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">Hi good day,</h2>
                                  <p>You submitted new booking: </p>
                                  <p><b>Booking ID:</b> ${booking_id}<br>
                                  <b>Booking Date:</b> ${reserve_date}<br>
                                  <b>₱ </b> ${roomPrices}<br>
                                  <b>Business Unit:</b> ${businessunit}<br>
                                  <b>Room:</b> ${roomName}<br>
                                  <b>Contact:</b> ${contact}<br>
                                  <b>Email:</b> ${email}<br>
                                  <b>Time:</b> ${time}<br>
                                  <b>Setup:</b> ${setup}<br>
                                  <b>Reserved By:</b> ${fname} ${lname}<br>
                                  ${table ? `<b>Additional Tables:</b> ${table}<br>` : ''}
                                  ${chair ? `<b>Additional Chairs:</b> ${chair}<br>` : ''}
                                  ${extension ? `<b>Extension Cord:</b> ${extension}<br>` : ''}
                                  ${hdmi ? `<b>HDMI Cable:</b> ${hdmi}<br>` : ''}

                                  <p style="text-align:justify">Please wait for the confirmation of your booking. We look forward to assisting you at the FAST Learning and Development Center. If you have any questions or need further assistance, feel free to contact us at jppsolis@fast.com.ph | Viber Number: +63 969 450 9412.</p>
                                  <p style="text-align:justify">Thank you for choosing FAST Learning and Development Center.</p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style="word-break:break-word;font-size:0px;padding:30px 0px">
                                <p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table align="center">
                <tr>
                  <td style="height:150px; border:none;border-radius:3px;color:black;padding:15px 19px" align="center" valign="middle">&copy; 2024-2025 <strong><span>FAST Learning and Development Center</span></strong></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'LOGO.png',
          path: logoPath, // Path to the logo image
          cid: 'logo_cid' // The 'cid' should match the embedded image's "src"
        }
      ]
    };

    try {
      // Check database connection and execute query
      await pool.query('SELECT NOW()'); // Test the connection

      const client = await pool.connect();
      try {
        // SQL query to insert data into the reservations table
        const result = await client.query(
          `INSERT INTO reservations (fname, lname, prices, reserve_date, time, setup, business_unit, room, roomid, guest, contact, email, "table", chair, hdmi, extension, message, booking_id, date_created) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW() AT TIME ZONE 'Asia/Manila')`,
          [fname, lname, roomPrices, reserve_date, time, setup, businessunit, roomName, roomID, guest, contact, email, table, chair, hdmi, extension, message, booking_id]
        );

        try {
          await transporter.sendMail(AdminNotif);
          await transporter.sendMail(ClientNotif);
          res.status(200).json({ message: 'Booking submitted successfully.' });
        } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: `There was a problem submitting the booking: ${error.message}` });
        }
        
      } catch (insertError) {
        console.error('Insert error:', insertError);
        res.status(500).json({ error: `Failed to insert booking into the database: ${insertError.message}` });
      } finally {
        client.release(); // Release the database client
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      res.status(500).json({ error: 'Database connection error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
