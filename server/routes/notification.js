import express from 'express'
import {
    post,
    getMailbox
} from '../controllers/notification.js'

const router = express.Router()

router.post('/notification', post)
router.get('/notification', getMailbox)

export default router