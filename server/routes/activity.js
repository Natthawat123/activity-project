import express from 'express'
import {
    manage,
    reserve,
    update,
    get,
    getOne,
    deleteActivity,
    updateStatus,
    transection
} from '../controllers/activity.js'

const Router = express.Router()

Router.get('/manage', manage)
Router.delete('/reserve/:act_ID', reserve)
Router.put('/activity/:id', update);
Router.put('/transection/:id', transection);
Router.get('/activity', get);
Router.get('/activity/:id', getOne);
Router.delete('/activity/:id', deleteActivity);
Router.put('/updateStatus/:id', updateStatus);
export default Router