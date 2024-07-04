import express from 'express'
import {
    manage,
    reserve
} from '../controllers/activity.js'

const Router = express.Router()

Router.get('/manage', manage)
Router.delete('/reserve', reserve)

export default Router