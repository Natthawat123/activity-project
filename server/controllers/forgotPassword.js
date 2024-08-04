import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import db from '../db.js'; // MySQL connection

// Request Password Reset
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  if (!user) {
    return res.status(404).send('No user with that email.');
  }

  const token = crypto.randomBytes(20).toString('hex');
  await db.query('UPDATE users SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?', [token, Date.now() + 3600000, email]);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    to: email,
    from: 'password-reset@yourdomain.com',
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           http://${req.headers.host}/reset-password/${token}\n\n
           If you did not request this, please ignore this email.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).send('Error sending email.');
    }
    res.status(200).send('Reset link sent.');
  });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const [user] = await db.query('SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiration > ?', [token, Date.now()]);

  if (!user) {
    return res.status(400).send('Password reset token is invalid or has expired.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query('UPDATE users SET password = ?, resetToken = ?, resetTokenExpiration = ? WHERE resetToken = ?', [hashedPassword, null, null, token]);

  res.status(200).send('Password has been reset.');
};
