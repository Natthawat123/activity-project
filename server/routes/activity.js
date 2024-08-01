import express from 'express'
import {
    createActivity,
    updateActivity,
    readActivity,
    readActivityOne,
    deleteActivity,
    updateStatus,
    transection
} from '../controllers/activity.js'

const Router = express.Router()

Router.post('/activitys/', createActivity);

Router.get('/activitys', readActivity);
Router.get('/activitys/:id', readActivityOne);

Router.put('/activitys/:id', updateActivity);

Router.delete('/activitys/:id', deleteActivity);

Router.put('/transection/:id', transection); // update transection
Router.put('/updateStatus/:id', updateStatus); // update status when upload to blockchain
export default Router