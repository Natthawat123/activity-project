import express from 'express'
import {activity, student, studentArr, staff, staffArr} from '../controllers/create.js'

const router = express.Router()

router.post('/activity', activity)
router.post('/student', student)
router.post('/students', studentArr)
router.post('/staff', staff)
router.post('/staffs', staffArr)

export default router