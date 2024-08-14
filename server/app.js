import express from 'express'
import cors from 'cors';




import authRoutes from './routes/auth.js'
import user from './routes/user.js'
import student from './routes/student.js'
import admin from './routes/admin.js'
import teacher from './routes/teacher.js'
import activity from './routes/activity.js'
import manage from './routes/manage.js'
import section from './routes/section.js'
import forgotPassword from './routes/forgotPassword.js'
import news from './routes/news.js'
import status from './routes/status.js'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)

//new
app.use('/', user)
app.use('/', student)
app.use('/', admin)
app.use('/', teacher)
app.use('/', activity)
app.use('/manage', manage)
app.use('/', section)
app.use('/', forgotPassword)
app.use('/', news)
app.use('/status', status)


app.listen(3000, () => console.log('server on port 3000'))







// // ตรวจสอบการเข้าใช้
// app.post('/authen', jsonParser, function (req, res, next) {
//     try {
//         const token = req.headers.authorization.split(' ')[1]
//         var decoded = jwt.verify(token, secret);
//         res.json({
//             status: 'ok',
//             decoded
//         })
//     } catch (error) {
//         res.json({
//             status: 'error',
//             message: error.message
//         })
//     }

// })




// app.get('/getStudent', (req, res) => {
//     connect.query('SELECT * FROM `student` ', (err, results) => {
//         if (err) {
//             console.log(err)
//             res.status(500).send('Internal Server Error')
//             return
//         }
//         res.json(results)
//     })
// })

// app.get('/getManage', (req, res) => {
//     connect.query('SELECT * FROM manage ', (err, results) => {
//         if (err) {
//             console.error('Error querying MySQL:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.json(results);
//     });
// });





// app.get('/login', (req, res) => {
//     connect.query('SELECT * FROM login ', (error, results, fields) => {
//         if (error) throw error;
//         res.json(results);
//     });
// });

// app.post('/api/reserve', (req, res) => {
//     const login_ID = req.body.login_ID; // Assuming stdID is sent in the request body

//     // Insert reservation data into MySQL
//     const query = 'INSERT INTO manage (std_ID) VALUES (?)';
//     connection.query(query, login_ID, (err, results) => {
//         if (err) {
//             console.error('Error inserting reservation:', err);
//             res.status(500).json({
//                 error: 'Error reserving activity'
//             });
//             return;
//         }
//         console.log('Reservation successful');
//         res.status(200).json({
//             message: 'Reservation successful'
//         });
//     });
// });

// app.post('/reserve', jsonParser, function (req, res) {
//     const {
//         man_status,
//         std_ID,
//         act_ID
//     } = req.body;
//     connect.query('INSERT INTO manage(`man_status`, `std_ID`, `act_ID`) VALUES (?, ?, ?)',
//         [man_status, std_ID, act_ID],
//         function (err, results) {
//             if (err) {
//                 console.error('Error inserting into database:', err);
//                 res.status(500).json({
//                     error: 'Internal Server Error'
//                 });
//             } else {
//                 res.json({
//                     status: 'ok'
//                 });
//             }
//         }
//     );
// });

// })