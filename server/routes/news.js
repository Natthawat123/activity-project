import express from 'express'
import {
    get,
    getOne,
    update,
    deleteNews,
    add
} from '../controllers/news.js'

const router = express.Router()

router.get('/news', get)
router.get('/news/:id', getOne)
router.post('/news', add)
router.put('/news/:id', update)
router.delete('/news', deleteNews)

export default router