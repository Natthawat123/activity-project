import express from 'express'
import {
    readManage,
    readManageOne,
    reserveActivity,
    cancelReserve,
    decreaseNumStd,
    upload,
    getByStd_ID,
    getByAct_ID


} from '../controllers/participate.js'
// import {
//     updateStatusNotJoin
// } from '../controllers/manage.js';
import {
    updateStatus
} from '../controllers/participate.js'; // Adjust the path as needed
const router = express.Router()

router.get('/participate', getByStd_ID)
router.get('/reserve', getByAct_ID)



router.get('/reserve/:id', readManageOne)
router.get('/upload', upload)

router.post('/participate', reserveActivity)

router.delete('/reserve', cancelReserve)
router.put('/cancelReserve', decreaseNumStd)
router.put('/manage', updateStatus);

export default router