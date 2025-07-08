import { atom } from 'jotai'
import { TypeNewTask } from '@mytype/typesNewTask'
import { TypeViewTask } from '@mytype/typeTask'

export const resetTask:TypeNewTask = {
    title: "",
    description: "",
    impact: 0,
    risk: 0,
    deadline: null,
    activation: null,
    taskchecks: [],
}

export const currentNewTask = atom<TypeNewTask>({...resetTask})

export const resetTask2:TypeViewTask = {
    id: -1,
    status: false,
    title: "",
    description: "",
    motivation: "",
    subtasks: [],

    created_at: "",
    deadline: null,
    activation: null,
    taskchecks: [],

    risk: 0,
    impact: 0,
    risk_proposals: "",
    risk_explanation: "",
    
    filters: {
        theme: [], // темы с id==-1 являются еще не существующими в базе данных
        state: {
            physical: [],
            intellectual: [],
            emotional: [],
            motivational: [],
            social: [],
        },
        stress: [],
        action_type: []
    }
}

export const currentNewTask2 = atom<TypeViewTask>({...resetTask2})

export const isOpenNewTaskEditor = atom<boolean>(false)
export const openedTabsTaskEditor = atom<string>("")

