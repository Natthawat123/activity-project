import express from 'express'

import {
    read,
    create
} from '../controllers/activity.js'

const router = express.Router()

router.get('/read', read)
router.post('/create', create)

export default router