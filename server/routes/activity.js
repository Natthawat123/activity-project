import express from 'express'
import {
    createActivity,
    updateActivity,
    getAll,
    readActivityOne,
    deleteActivity,
    updateStatus,
    transection
} from '../controllers/activity.js'

const Router = express.Router()

Router.post('/activity', createActivity);

Router.get('/activitys', getAll);
Router.get('/activitys/:id', readActivityOne);

Router.put('/activity/:id', updateActivity);

Router.delete('/activitys/:id', deleteActivity);

Router.put('/updateStatus/:id', updateStatus);
Router.put('/transection/:id', transection);
export default Router