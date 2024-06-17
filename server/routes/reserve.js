import express from 'express'
import {
    activity,
} from '../controllers/reserve.js'

const router = express.Router()

router.post('/activity', activity)

export default router