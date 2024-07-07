import express from 'express'
import {
    manage,
    reserve,
    update,
    get,
    getOne
} from '../controllers/activity.js'

const Router = express.Router()

Router.get('/manage', manage)
Router.delete('/reserve', reserve)
Router.put('/activity/:id', update);
Router.get('/activity', get);
Router.get('/activity/:id', getOne);
export default Router