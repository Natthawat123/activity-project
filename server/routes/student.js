import express from 'express'
import {
    update,
    resume,
    section,
    read
} from '../controllers/student.js'

const router = express.Router()

router.get('/resume', resume)
router.get('/read', read)
router.put('/update/:id', update)
router.get('/section', section)

export default router