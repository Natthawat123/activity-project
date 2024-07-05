import express from 'express'
import {
    student,
    staff
} from '../controllers/update.js'

const router = express.Router()

router.put('/student/:id', student)
router.put('/staff/:id', staff)

export default router