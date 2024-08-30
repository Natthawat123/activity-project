import express from 'express'
import {
    readManage,
    readManageOne,
    reserveActivity,
    cancelReserve,
    decreaseNumStd,
    upload,
    getAll


} from '../controllers/participate.js'
// import {
//     updateStatusNotJoin
// } from '../controllers/manage.js';
import {
    updateStatus
} from '../controllers/participate.js'; // Adjust the path as needed
const router = express.Router()

router.get('/participates', getAll)
router.get('/reserve/:id', readManageOne)
router.get('/upload', upload)

router.post('/reserve', reserveActivity)

router.delete('/reserve', cancelReserve)
router.put('/cancelReserve', decreaseNumStd)
router.put('/manage', updateStatus);

export default router