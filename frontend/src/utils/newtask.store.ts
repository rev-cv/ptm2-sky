import { atom } from 'jotai'
import { TypeNewTask } from '@mytype/typesNewTask'

export const resetTask:TypeNewTask = {
    title: "",
    description: "",
    impact: 0,
    risk: 0,
    deadline: null,
    activation: null,
    taskchecks: [],
}

export const currentNewTask = atom<TypeNewTask>({...resetTask});