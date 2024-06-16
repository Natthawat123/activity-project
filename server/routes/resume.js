import express from 'express'
import {
    student,
    staff
} from '../controllers/resume.js'

const router = express.Router()

router.get('/student', student)
router.get('/staff', staff)

export default router