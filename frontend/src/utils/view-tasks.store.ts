import { atom } from 'jotai'
import { TypeViewTask } from '@mytype/typeTask'

export const viewTasks = atom<TypeViewTask[]>([]);