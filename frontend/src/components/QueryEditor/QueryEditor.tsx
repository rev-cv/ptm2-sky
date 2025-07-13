import './style.scss'
import { useState, useRef, useEffect } from 'react'
import { useAtomValue, queryAllTasks, atomQuerySelect, atomQueryList, atomFilterList } from '@utils/jotai.store'
import { TypeQuery } from '@mytype/typeSaveQueries'
import { TypeFilterServer } from '@mytype/typeSearchAndFilter'

import Modal from '@comps/Modal/Modal'
import Button from '@comps/Button/Button'
import Toggle from '@comps/Toggles/Toggle'
import BlockEditor from './BlockEditor'
import BlockThemeEditor from './BlockThemeEditor'

import IcoQuery from '@asset/query.svg'
import IcoEdit from '@asset/edit.svg'
import IcoAdd from '@asset/add.svg'
import IcoBack from '@asset/back.svg'

type TypeProps = {
    onExit?: () => void
}

function QueryEditor({onExit}:TypeProps) {
    const [visible, setVisible] = useState(true)
    const [queryOrTheme, setQOrT] = useState<0|1>(0)
    const [editableQuery, setEditableQuery] = useState<TypeQuery|TypeFilterServer|null>(null)
    const queryList = useAtomValue(atomQueryList)
    const querySelect = useAtomValue(atomQuerySelect)
    const filterList = useAtomValue(atomFilterList)

    const refEditor = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editableQuery) {
            refEditor.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [editableQuery])

    return <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onExited={() => {
            if (onExit) onExit()
            setVisible(true)
        }}
        className={`modal-query-editor${editableQuery ? ' modal-query-editor--open' : ''}`}
        >
        <div className={`query-editor${editableQuery ? ' query-editor--open' : ''}`}>
            <div className="query-editor__list">
                <div className="query-editor__list-continer-menu">
                    <Toggle 
                        elements={[
                            {label: "запросы", value: 0},
                            {label: "темы", value: 1}
                        ]}
                        activeValue={queryOrTheme}
                        onChange={v => {
                            setQOrT(v as 0|1)
                            setEditableQuery(null)
                        }}
                    />
                    <Button
                        IconComponent={IcoAdd}
                        variant='first'
                        onClick={() => {setEditableQuery(
                            (!editableQuery || 0 < editableQuery.id) ? 
                            {...queryAllTasks, name:"", descr:""} : null)
                        }}
                    />
                </div>

                <div className="query-editor__list-continer">
                    { queryOrTheme === 0 ? <>
                        { editableQuery ? null :
                            <div 
                                key={`query-all-tasks`} 
                                className={`query-editor__item`}
                                >
                                <Button 
                                    IconComponent={IcoQuery}
                                    text={queryAllTasks.name}
                                    variant={querySelect?.id === queryAllTasks.id ? 'first' : 'second'}
                                    className="query-editor__item-title"
                                />
                            </div>
                        }
                        {queryList.map((query, index) => (
                            <div 
                                key={`query-${index}-with-id-${query.id}`}
                                className={`query-editor__item`}
                                >
                                <Button 
                                    IconComponent={
                                        editableQuery ?
                                            editableQuery.id === query.id ? IcoBack : IcoEdit : IcoQuery
                                        }
                                    text={query.name}
                                    variant={((querySelect?.id === query.id) || (editableQuery && editableQuery.id === query.id)) ? 'first' : 'second'}
                                    className="query-editor__item-title"
                                    onClick={() => {
                                        if (editableQuery) {
                                            setEditableQuery(editableQuery.id === query.id ? null : query)
                                        } else {
                                            setVisible(false)
                                        }
                                    }}
                                />
                                { editableQuery ? null :
                                    <Button 
                                        IconComponent={IcoEdit}
                                        variant='second'
                                        className={'query-editor__item-edit-btn'}
                                        onClick={() => setEditableQuery(query)}
                                    />
                                }
                            </div>
                        ))}
                    </> : null }

                    {queryOrTheme === 1 ? <>
                        {filterList?.theme.map((theme, index) => (
                            <div 
                                key={`query-${index}-with-id-${theme.id}`}
                                className={`query-editor__item`}
                                >
                                <Button 
                                    IconComponent={editableQuery ? IcoEdit : IcoQuery}
                                    text={theme.name}
                                    variant={((querySelect?.id === theme.id) || (editableQuery && editableQuery.id === theme.id)) ? 'first' : 'second'}
                                    className="query-editor__item-title"
                                    onClick={() => {
                                        if (editableQuery) {
                                            setEditableQuery(editableQuery.id === theme.id ? null : theme)
                                        } else {
                                            setVisible(false)
                                        }
                                    }}
                                />
                                { editableQuery ? null :
                                    <Button 
                                        IconComponent={IcoEdit}
                                        variant='second'
                                        className={'query-editor__item-edit-btn'}
                                        onClick={() => setEditableQuery(theme)}
                                    />
                                }
                            </div>
                        ))}
                    </> : null}
                </div>
            </div>
            <div className="query-editor__editor query-block-editor" ref={refEditor}>
                { (editableQuery && queryOrTheme === 0) ?
                    <BlockEditor 
                        title={editableQuery.id < 0 ? 'new query' : `edit query : ${editableQuery.id}`}
                        editable={editableQuery as TypeQuery}
                        updateEditable={(query: TypeQuery) => setEditableQuery(query)}
                    />:null
                }
                { (editableQuery && queryOrTheme === 1) ?
                    <BlockThemeEditor 
                        title={editableQuery.id < 0 ? 'new theme' : `edit theme : ${editableQuery.id}`}
                        editable={editableQuery as TypeFilterServer}
                        updateEditable={(query: TypeFilterServer) => setEditableQuery(query)}
                    />:null
                }
            </div>
        </div>
    </Modal>
}

export default QueryEditor;