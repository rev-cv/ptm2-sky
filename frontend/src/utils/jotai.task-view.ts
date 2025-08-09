import { atom } from 'jotai'
import { TypeViewTask } from '@mytype/typeTask'

export const atomViewTasks = atom<TypeViewTask[]>([])

export const atomViewTasksPage = atom<number>(1)
// ↑ текущая страница для текущего запроса

export const atomViewTasksAllCount = atom<number>(0)
// ↑ общее кол-во элементов в бд для текущего запроса


