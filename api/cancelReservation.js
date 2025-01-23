// const { Pool } = require("pg");
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// });

// const nodemailer = require('nodemailer');
// const path = require('path');

// const logoPath = path.join(__dirname, '../public/images/LOGO.png');

// module.exports = async (req, res) => {
//   try {
//     const { reservation_id } = req.body;  // Get reservation_id from the body

//     if (!reservation_id) {
//       console.error("Reservation ID is missing in the request.");
//       return res.status(400).json({ error: "Reservation ID is required." });
//     }

//     console.log(`Cancelling reservation for ID: ${reservation_id}`);

//     const query = `
//       UPDATE reservations
//       SET reserve_status = 'CANCELLED'
//       WHERE reservation_id = $1 OR booking_id = $1;
//     `;
//     const values = [reservation_id];

//     const result = await pool.query(query, values);

//     if (result.rowCount === 0) {
//       console.log(`No reservation found for ID: ${reservation_id}`);
//       return res.status(404).json({ error: "No reservation found to cancel." });
//     }

//             // Create the transporter for sending email
//             const transporter = nodemailer.createTransport({
//                 host: 'smtp.gmail.com',
//                 port: 587,
//                 secure: false, // true for 465, false for other ports
//                 auth: {
//                   user: process.env.EMAIL_USER, // Your email address
//                   pass: process.env.EMAIL_PASS, // Your email password
//                 },
//               });
      
//               const bookingDetails = result.rows[0];
//                   const ClientNotif = {
//                     from: process.env.EMAIL_USER,
//                     to: bookingDetails.email, // Use process.env.EMAIL_USER for recipient
//                     subject: `Reservation Status Update - CANCELLED`,
//                     html: `
//                       <div style="background:#f3f3f3">
//                         <div style="margin:0px auto;max-width:640px;background:transparent">
//                           <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
//                             <tbody>
//                               <tr>
//                                 <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px">
//                                   <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
//                                     <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                       <tbody>
//                                         <tr>
//                                           <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
//                                             <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px" align="center" border="0">
//                                               <tbody>
//                                                 <tr>
//                                                   <td style="width:138px">
//                                                     <img alt="" title="" height="100px" width="200px" src="cid:logo_cid" style="">
//                                                   </td>
//                                                 </tr>
//                                               </tbody>
//                                             </table>
//                                           </td>
//                                         </tr>
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                         <div style="max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden">
//                           <div style="margin:0px auto;max-width:640px;background:#fdfdfd">
//                             <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fdfdfd" align="center" border="0">
//                               <tbody>
//                                 <tr>
//                                   <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px">
//                                     <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
//                                       <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
//                                         <tbody>
//                                           <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
//                                               <div style="color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left">
//                                                 <h2 style="font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">Hi good day,</h2>
//                                                 <p>You successfully cancelled your booking: </p>
//                                                 <p><b>Booking/Reservation ID:</b> ${bookingDetails.booking_id}<br>
//                                                 <b>Booking Date:</b> ${bookingDetails.reserve_date}<br>
//                                                 <b>Cost: ₱ </b> ${bookingDetails.prices}<br>
//                                                 <b>Business Unit:</b> ${bookingDetails.business_unit}<br>
//                                                 <b>Branch:</b> ${bookingDetails.branch}<br>
//                                                 <b>Room:</b> ${bookingDetails.room_name}<br>
//                                                 <b>Contact:</b> ${bookingDetails.contact}<br>
//                                                 <b>Email:</b> ${bookingDetails.email}<br>
//                                                 <b>Time:</b> ${bookingDetails.time}<br>
//                                                 <b>Setup:</b> ${bookingDetails.setup}<br>
//                                                 <b>Reserved By:</b> ${bookingDetails.fname} ${bookingDetails.lname}<br>
//                                                 ${bookingDetails.table ? `<b>Additional Tables:</b> ${bookingDetails.table}<br>` : ''}
//                                                 ${bookingDetails.chair ? `<b>Additional Chairs:</b> ${bookingDetails.chair}<br>` : ''}
//                                                 ${bookingDetails.extension ? `<b>Extension Cord:</b> ${bookingDetails.extension}<br>` : ''}
//                                                 ${bookingDetails.hdmi ? `<b>HDMI Cable:</b> ${bookingDetails.hdmi}<br>` : ''}
              
//                                                 <p style="text-align:justify">We look forward to assisting you at the FAST Learning and Development Center. If you have any questions or need further assistance, feel free to contact us at jppsolis@fast.com.ph | Viber Number: +63 969 450 9412.</p>
//                                                 <p style="text-align:justify">Thank you for choosing FAST Learning and Development Center.</p>
//                                               </div>
//                                             </td>
//                                           </tr>
//                                           <tr>
//                                             <td style="word-break:break-word;font-size:0px;padding:30px 0px">
//                                               <p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p>
//                                             </td>
//                                           </tr>
//                                         </tbody>
//                                       </table>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </div>
//                           <div>
//                             <table align="center">
//                               <tr>
//                                 <td style="height:150px; border:none;border-radius:3px;color:black;padding:15px 19px" align="center" valign="middle">&copy; 2024-2025 <strong><span>FAST Learning and Development Center</span></strong></td>
//                               </tr>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     `,
//                     attachments: [
//                       {
//                         filename: 'LOGO.png',
//                         path: logoPath, // Path to the logo image
//                         cid: 'logo_cid' // The 'cid' should match the embedded image's "src"
//                       }
//                     ]
//                   };
//                 await transporter.sendMail(ClientNotif);

//     console.log(`Reservation cancelled: ${JSON.stringify(result.rows[0])}`);
//     res.status(200).json({ message: "Reservation cancelled successfully.", data: result.rows[0] });
//   } catch (error) {
//     console.error("Error cancelling reservation:", error.message);
//     res.status(500).json({ error: `Server error: ${error.message}` });
//   }
// };
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const nodemailer = require('nodemailer');
const path = require('path');

const logoPath = path.join(__dirname, '../public/images/LOGO.png');

module.exports = async (req, res) => {
  try {
    const { reservation_id } = req.body; // Get reservation_id from the body

    if (!reservation_id) {
      console.error("Reservation ID is missing in the request.");
      return res.status(400).json({ error: "Reservation ID is required." });
    }

    console.log(`Cancelling reservation for ID: ${reservation_id}`);

    // Fetch reservation details first
    const selectQuery = `
      SELECT * FROM reservations
      WHERE reservation_id = $1 OR booking_id = $1;
    `;
    const selectResult = await pool.query(selectQuery, [reservation_id]);

    if (selectResult.rowCount === 0) {
      console.log(`No reservation found for ID: ${reservation_id}`);
      return res.status(404).json({ error: "No reservation found to cancel." });
    }

    const bookingDetails = selectResult.rows[0];

    // Perform the update
    const updateQuery = `
      UPDATE reservations
      SET reserve_status = 'CANCELLED'
      WHERE reservation_id = $1 OR booking_id = $1;
    `;
    await pool.query(updateQuery, [reservation_id]);

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

    // Prepare the email notification
    const ClientNotif = {
      from: process.env.EMAIL_USER,
      to: bookingDetails.email,
      subject: `Reservation Status Update - CANCELLED`,
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
                                  <h2>Hi good day,</h2>
                                  <p>You successfully cancelled your booking:</p>
                                  <p><b>Booking/Reservation ID:</b> ${bookingDetails.booking_id}<br>
                                  <b>Booking Date:</b> ${bookingDetails.reserve_date}<br>
                                  <b>Cost:</b> ₱${bookingDetails.prices}<br>
                                  <b>Business Unit:</b> ${bookingDetails.business_unit}<br>
                                  <b>Branch:</b> ${bookingDetails.branch}<br>
                                  <b>Room:</b> ${bookingDetails.room_name}<br>
                                  <b>Contact:</b> ${bookingDetails.contact}<br>
                                  <b>Email:</b> ${bookingDetails.email}<br>
                                  <b>Time:</b> ${bookingDetails.time}<br>
                                  <b>Setup:</b> ${bookingDetails.setup}<br>
                                  <b>Reserved By:</b> ${bookingDetails.fname} ${bookingDetails.lname}</p>
                                  <p>Thank you for choosing FAST Learning and Development Center.</p>
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
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'LOGO.png',
          path: logoPath,
          cid: 'logo_cid',
        },
      ],
    };

    // Send the email
    await transporter.sendMail(ClientNotif);

    console.log(`Reservation cancelled: ${JSON.stringify(bookingDetails)}`);
    res.status(200).json({ message: "Reservation cancelled successfully.", data: bookingDetails });
  } catch (error) {
    console.error("Error cancelling reservation:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
