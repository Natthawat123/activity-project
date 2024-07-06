import express from 'express'
import {activity, student, staff} from '../controllers/create.js'

const router = express.Router()

router.post('/activity', activity)
router.post('/student', student)
router.post('/staff', staff)

export default router