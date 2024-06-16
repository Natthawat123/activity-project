import express from 'express'
import {
    student,
    staff
} from '../controllers/update.js'

const router = express.Router()

router.put('/student', student)
router.put('/staff', staff)

export default router