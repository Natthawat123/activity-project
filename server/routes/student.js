import express from 'express'
import {
    deleteStd
} from '../controllers/student.js'

const router = express.Router()

router.delete('/student/:id', deleteStd)

export default router