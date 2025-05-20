import { atom } from 'jotai';
import { TypeNewTask } from '@mytype/typesNewTask'

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
