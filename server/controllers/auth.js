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
                }else if(user[0].role === 'student') {
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
    const {
        login_ID,
        username,
        password,
        role
    } = req.body

    if (!login_ID || !username || !password || !role) {
        return res.status(400).json('required : login_ID ,uername, password and role')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const q = 'INSERT INTO login (login_ID, username, password, role) VALUES (?, ?, ?, ?)'

    db.query(q, [login_ID, username, hashedPassword, role], (err, results) => {
        if (err) {
            return res.status(500).json(err)
        }
        res.status(201).json({
            message: 'registered successfully'
        })
    })
}