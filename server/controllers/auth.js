import db from '../db.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secret = 'Fullstack-Login'
const saltRounds = 10;

//login
export const login = (req, res) => {
    const {
        username,
        password
    } = req.body
    const q = `SELECT login.*, student.std_ID, staff.staff_ID  
    FROM login 
    LEFT JOIN student ON login.login_ID = student.login_ID 
    LEFT JOIN staff ON login.login_ID = staff.login_ID WHERE Username=?`

    db.query(q, username, (err, user) => {
        if (err) return res.status(500).json(err)
        if (user.length === 0) return res.status(404).json('user not found')

        bcrypt.compare(password, user[0].password, function (err, isLogin) {
            if (isLogin) {
                var token = jwt.sign({
                    username: user[0].username,
                    role: user[0].role, // เพิ่มบทบาทใน token
                }, secret, {
                    expiresIn: '1h'
                });
                if (user[0].role === 'teacher' || user[0].role === 'admin') {
                    res.json({
                        status: 'ok',
                        message: 'Login Success',
                        token,
                        role: user[0].role,
                        staff_ID: user[0].staff_ID // ส่งบทบาทในการตอบกลับ
                    });
                } else if (user[0].role === 'student') {
                    res.json({
                        status: 'ok',
                        message: 'Login Success',
                        token,
                        role: user[0].role,
                        std_ID: user[0].std_ID // ส่งบทบาทในการตอบกลับ
                    });
                }

            } else {
                res.json({
                    status: 'error',
                    message: 'Login Failed'
                });
            }
        });
    })
}

// create user  table login
export const register = async (req, res) => {
    try {
      console.log('Received request body:', req.body); // Log the received request body
  
      const { username, password, role } = req.body;
  
      if (!username || !password || !role) {
        return res.status(400).json({ message: 'Required fields: username, password, and role' });
      }
  
      // Ensure password is a string before hashing
      if (typeof password !== 'string') {
        return res.status(400).json({ message: 'Password must be a string' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const q = 'INSERT INTO login (username, password, role) VALUES (?, ?, ?)';
      db.query(q, [username, hashedPassword, role], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Failed to register user', error: err });
        }
  
        const loginID = results.insertId;
        res.status(201).json({
          status: 'ok',
          message: 'Registered successfully',
          login_ID: loginID
        });
      });
    } catch (error) {
      console.error('Error in register function:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

// create user  table login
export const arrayregister = async (req, res) => {
  try {
      console.log('Received request body:', req.body); // Log the received request body

      const users = req.body;

      if (!Array.isArray(users)) {
          return res.status(400).json({ message: 'Request body must be an array of users' });
      }

      const insertPromises = users.map(async user => {
          const { username, password, role } = user;

          if (!username || !password || !role) {
              throw new Error('Required fields: username, password, and role');
          }

          // Ensure password is a string before hashing
          if (typeof password !== 'string') {
              throw new Error('Password must be a string');
          }

          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const q = 'INSERT INTO login (username, password, role) VALUES (?, ?, ?)';
          return new Promise((resolve, reject) => {
              db.query(q, [username, hashedPassword, role], (err, results) => {
                  if (err) {
                      console.error('Error inserting user:', err);
                      reject(new Error('Failed to register user'));
                  } else {
                      const loginID = results.insertId;
                      resolve({ status: 'ok', message: 'Registered successfully', login_ID: loginID });
                  }
              });
          });
      });

      const results = await Promise.all(insertPromises);
      res.status(201).json(results);
  } catch (error) {
      console.error('Error in register function:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


  