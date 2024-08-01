import express from 'express'
import {
    readTeacherAll,
    readTeacherOne,
    createStudent,
    updateTeacher
} from '../controllers/teacher.js'

const router = express.Router()

router.get('/teachers', readTeacherAll)
router.get('/teachers/:id', readTeacherOne)

router.post('/teachers', createStudent)

router.put('/teachers/:id', updateTeacher)

export default router