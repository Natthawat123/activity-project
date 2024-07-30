import express from 'express'
import {
    activity,
    numStdReserve,
    deleteReserve
} from '../controllers/reserve.js'

const router = express.Router()

router.post('/activity', activity)
router.put('/numStdReserve', numStdReserve)
router.delete('/reserve/:std_ID/:act_ID', deleteReserve)

export default router