import { atom } from 'jotai'
import { TypeNewTask } from '@mytype/typesNewTask'
import { TypeSearchPanel, TypeFilterAssocServer } from '@mytype/typeSearchAndFilter'

// открытая боковая панель
export const openSidePanel = atom<'none' | 'right' | 'left' | 'setting'>("none")

// атом для хранения текущей темы
export const themeAtom = atom<'light' | 'dark' | 'auto'>(
    (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto'
)
  
// сохранение темы в localStorage
export const themeWithStorageAtom = atom(
    (get) => get(themeAtom),
    (_, set, newTheme: 'light' | 'dark' | 'auto') => {
        set(themeAtom, newTheme);
        localStorage.setItem('theme', newTheme);
    }
)

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

// атом для хранения запроса для получения задач
export const searchRequest = atom<TypeSearchPanel>({
    text: "",
    filters: [],
    lastOpenedPage: 1,
    sorted: "",
    activation: [null, null],
    deadline: [null, null],
    taskchecks: [null, null],
    risk: [],
    impact: [],
})

export const searchRequestID = atom((get) => 
    get(searchRequest).filters.map(f => f.id)
)

export const filterFromServer = atom<TypeFilterAssocServer|null>(null)

export const stateNames = {
    "physical": "физическое",
    "intellectual": "интеллектуальное",
    "emotional": "эмоциональное",
    "motivational": "мотивационное",
    "social": "социальное",
}