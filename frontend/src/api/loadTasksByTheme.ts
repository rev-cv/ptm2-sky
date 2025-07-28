import { getDefaultStore, queryAllTasks, atomQuerySelect } from '@utils/jotai.store'
import { loadTasks } from './loadTasks2'

export function loadTasksByTheme (text:string, themeID:number) {
    const store = getDefaultStore()

    store.set(atomQuerySelect, {
        ...queryAllTasks,
        name: text,
        infilt: [themeID],
    })

    loadTasks()
}
