import { atom } from 'jotai'
import { TypeViewTask } from '@mytype/typeTask'

export const resetTask2:TypeViewTask = {
    id: -1,
    status: false,
    title: "",
    description: "",
    motivation: "",
    subtasks: [],

    created_at: "",
    activation: null,
    taskchecks: [],
    deadline: null,
    finished_at: null,

    risk: 0,
    impact: 0,
    risk_proposals: "",
    risk_explanation: "",
    
    themes: [],
    actions: [],

    stress: 0,
    apathy: 0,
    meditative: 0,
    comfort: 0,
    automaticity: 0,
    significance: 0,
    
    physical: 0,
    intellectual: 0,
    motivational: 0,
    emotional: 0,
    financial: 0,
    temporal: 0,
    social: 0
}

export const currentNewTask2 = atom<TypeViewTask>(structuredClone(resetTask2))

export const isOpenNewTaskEditor = atom<boolean>(false)
export const openedTabsTaskEditor = atom<number>(0)

