import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import listRoutes from './routes/list.js'
import createRoutes from './routes/create.js'
import resumeRoutes from './routes/resume.js'
import updateRoutes from './routes/update.js'
import reserveRoutes from './routes/reserve.js'
<<<<<<< HEAD
=======
import activityRoutes from './routes/activity.js'
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)

const app = express()
app.use(express.json())
// app.use(cors())

app.use('/auth', authRoutes)
app.use('/list', listRoutes)
app.use('/create', createRoutes)
app.use('/resume', resumeRoutes)
app.use('/update', updateRoutes)
app.use('/reserve', reserveRoutes)
<<<<<<< HEAD
=======
app.use('/', activityRoutes)
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)

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