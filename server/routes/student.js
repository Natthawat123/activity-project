import express from 'express'
import {
    createStudent,
    getStudent,
    getstudentOne,
    updateStudent,
    deleteStudent
} from '../controllers/student.js'

const router = express.Router()


router.post('/students', createStudent)
router.get('/students', getStudent)
router.get('/students/:id', getstudentOne)
router.put('/students/:id', updateStudent)
router.delete('/students/:id', deleteStudent)

export default router