import express from 'express'
import {
    read,
    update,
    resume
} from '../controllers/staff.js'

const router = express.Router()

router.get('/read', read)
router.get('/resume', resume)
router.put('/update/:id', update)

export default router