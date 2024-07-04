import express from 'express'
import {
    student,
    staff
} from '../controllers/update.js'

const router = express.Router()

<<<<<<< HEAD
router.put('/student', student)
router.put('/staff', staff)
=======
router.put('/student/:id', student)
router.put('/staff/:id', staff)
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)

export default router