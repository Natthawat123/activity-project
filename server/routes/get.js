import express from 'express'
import {
    login
} from '../controllers/get.js'

const router = express.Router()

router.get('/login', login)

export default router