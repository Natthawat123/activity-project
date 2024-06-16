import express from 'express'
import {
    login,
    student,
    activity,
    section
} from '../controllers/list.js'

const router = express.Router()

router.get('/login', login)
router.get('/student', student)
router.get('/activity', activity)
router.get('/section', section)

export default router