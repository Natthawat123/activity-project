import express from 'express'
import {
    activity,
    numStdReserve
} from '../controllers/reserve.js'

const router = express.Router()

router.post('/activity', activity)
router.put('/numStdReserve', numStdReserve)

export default router