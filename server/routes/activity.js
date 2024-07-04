import express from 'express'
import {
<<<<<<< HEAD
    manage
=======
    manage,
    reserve
>>>>>>> karan
} from '../controllers/activity.js'

const Router = express.Router()

Router.get('/manage', manage)
<<<<<<< HEAD
=======
Router.delete('/reserve', reserve)
>>>>>>> karan

export default Router