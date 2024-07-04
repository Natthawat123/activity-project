import express from 'express'
import {
    login,
    student,
<<<<<<< HEAD
    staff,
=======
<<<<<<< HEAD
=======
    staff,
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
    activity,
    section,
    upload
} from '../controllers/list.js'

const router = express.Router()

router.get('/login', login)
router.get('/student', student)
<<<<<<< HEAD
router.get('/staff', staff)
=======
<<<<<<< HEAD
=======
router.get('/staff', staff)
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
router.get('/activity', activity)
router.get('/section', section)
router.get('/upload', upload)

export default router