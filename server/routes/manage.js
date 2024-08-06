import express from 'express'
import {
    readManage,
    readManageOne,
    reserveActivity,
    cancelReserve,
    decreaseNumStd,
    upload
} from '../controllers/manage.js'

const router = express.Router()

router.get('/reserve', readManage)
router.get('/reserve/:id', readManageOne)
router.get('/upload', upload)

router.post('/reserve', reserveActivity)

router.delete('/reserve', cancelReserve)
router.put('/cancelReserve', decreaseNumStd)
export default router