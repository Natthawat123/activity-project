import express from 'express'
import {
    manage
} from '../controllers/activity.js'

const Router = express.Router()

Router.get('/manage', manage)

export default Router