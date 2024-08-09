import express from 'express'
import {
    get,
    getOne,
    update,
    deleteNews,
    addActivity,
    updateAct_title
} from '../controllers/news.js'

const router = express.Router()

router.get('/news', get)
router.get('/news/:id', getOne)
router.post('/news', addActivity)
router.put('/news', update)
router.put('/newsAct', updateAct_title)
router.delete('/news', deleteNews)

export default router