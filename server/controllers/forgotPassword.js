import { MailerSend } from 'mailersend';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import dbPromise from '../dbPromise.js'; // MySQL promise connection

// Initialize MailerSend
const mailerSend = new MailerSend({
  api_key: 'mlsn.2e1e95210c687a55948c32c8dc3048f04da20c5b7e52f29f364a3462ea63c78d'
});

// Request Password Reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Search email in all related tables
    const [studentResult] = await dbPromise.query('SELECT * FROM student WHERE std_email = ?', [email]);
    const [teacherResult] = await dbPromise.query('SELECT * FROM teacher WHERE staff_email = ?', [email]);
    const [adminResult] = await dbPromise.query('SELECT * FROM admin WHERE email = ?', [email]);

    let user = null;
    let role = null;

    if (Array.isArray(studentResult) && studentResult.length > 0) {
      user = studentResult[0];
      role = 'student';
    } else if (Array.isArray(teacherResult) && teacherResult.length > 0) {
      user = teacherResult[0];
      role = 'teacher';
    } else if (Array.isArray(adminResult) && adminResult.length > 0) {
      user = adminResult[0];
      role = 'admin';
    }

    if (!user) {
      return res.status(404).send('No user with that email.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    await dbPromise.query('UPDATE login SET resetToken = ?, resetTokenExpiration = ? WHERE role = ? AND login_ID = ?', [token, Date.now() + 3600000, role, user.login_ID]);

    // Send reset email using MailerSend
    const response = await mailerSend.email.send({
      from: 'itnpru64@gmail.com',
      to: email,
      subject: 'รีเซ็ตรหัสผ่านของคุณ',
      text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/reset-password/${token}\n\n
             If you did not request this, please ignore this email.\n`,
    });

    console.log('Email sent successfully:', response);
    res.status(200).send('Reset link sent.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error.');
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // ตรวจสอบ token ว่ายังไม่หมดอายุ
    const [user] = await dbPromise.query('SELECT * FROM login WHERE resetToken = ? AND resetTokenExpiration > ?', [token, Date.now()]);

    if (Array.isArray(user) && user.length === 0) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // อัปเดตรหัสผ่านใหม่ในตาราง login
    await dbPromise.query('UPDATE login SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE resetToken = ?', [hashedPassword, token]);

    res.status(200).send('Password has been reset.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error.');
  }
};
