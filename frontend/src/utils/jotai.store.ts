import { atom } from 'jotai';
import { TypeNewTask } from '@mytype/typesNewTask'
import { TypeSearchPanel } from '@mytype/typeSearchAndFilter'

// открытая боковая панель
export const openSidePanel = atom<'none' | 'right' | 'left' | 'setting'>("none");

// атом для хранения текущей темы
export const themeAtom = atom<'light' | 'dark' | 'auto'>(
    (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto'
);
  
// сохранение темы в localStorage
export const themeWithStorageAtom = atom(
    (get) => get(themeAtom),
    (_, set, newTheme: 'light' | 'dark' | 'auto') => {
        set(themeAtom, newTheme);
        localStorage.setItem('theme', newTheme);
    }
);

export const resetTask:TypeNewTask = {
    title: "",
    description: "",
    impact: 0,
    deadline: null,
    activation: null,
    taskchecks: [],
}
export const currentNewTask = atom<TypeNewTask>({...resetTask});

// атом для хранения запроса для получения задач
export const searchRequest = atom<TypeSearchPanel>({
    text: "",
    filters: [
        {
            type: "энергия",
            id: 24,
            value: "Аналитические задачи"
        },

        {
            type: "энергия",
            id: 24,
            value: "Стратегические задачи"
        },

        {
            type: "энергия",
            id: 24,
            value: "Энергия"
        },

        {
            type: "энергия",
            id: 24,
            value: "Мотивация"
        },

        {
            type: "энергия",
            id: 24,
            value: "Здравоохранение"
        },
    ],
    lastOpenedPage: 1,
    sorted: ""
})