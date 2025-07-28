import './style.scss'
import { useState, useRef } from 'react'
import { useAtomValue, useAtom, queryAllTasks, atomQuerySelect, atomQueryList, atomThemeList } from '@utils/jotai.store'
import { TypeQuery } from '@mytype/typeQueries'
import { TypeFilterNew } from '@mytype/typeFilters'

import { loadTasksByTheme } from '@api/loadTasksByTheme'

import Modal from '@comps/Modal/Modal'
import Button from '@comps/Button/Button'
import Toggle from '@comps/Toggles/Toggle'
import BlockEditor from './BlockEditor'
import BlockThemeEditor from './BlockThemeEditor'

import IcoQuery from '@asset/query.svg'
import IcoEdit from '@asset/edit.svg'
import IcoAdd from '@asset/add.svg'
import IcoTag from '@asset/tag.svg'
import IcoBack from '@asset/back.svg'

type TypeProps = {
    onExit?: () => void
}

function QueryEditor({onExit}:TypeProps) {
    const [visible, setVisible] = useState(true)
    const [queryOrTheme, setQOrT] = useState<0|1>(0)
    const [editableQuery, setEditableQuery] = useState<TypeQuery|TypeFilterNew|null>(null)
    const queryList = useAtomValue(atomQueryList)
    const [querySelect, setQuerySelect] = useAtom(atomQuerySelect)
    const themeList = useAtomValue(atomThemeList)

    const refEditor = useRef<HTMLDivElement>(null)

    const scrollToTop = () => {
        if (refEditor.current) {
            refEditor.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

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
                            {label: "темы", value: 1},
                            {label: "запросы", value: 0}
                        ]}
                        activeValue={queryOrTheme}
                        onChange={v => {
                            setQOrT(v as 0|1)
                            setEditableQuery(null)
                        }}
                    />
                    <Button
                        icon={IcoAdd}
                        variant='first'
                        onClick={() => {
                            const newform = (queryOrTheme === 0) ? 
                                {...queryAllTasks, name:"", descr:""} : 
                                {id:-1, name:"", desc:"", type:"theme"}
                            setEditableQuery(
                                (!editableQuery || 0 < editableQuery.id) ? newform : null
                            )
                            scrollToTop()
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
                                    icon={IcoQuery}
                                    text={queryAllTasks.name}
                                    variant={querySelect?.id === queryAllTasks.id ? 'first' : 'second'}
                                    className="query-editor__item-title"
                                    onClick={() => {
                                        setVisible(false)
                                        setQuerySelect({...queryAllTasks})
                                    }}
                                />
                            </div>
                        }
                        {queryList.map((query, index) => (
                            <div 
                                key={`query-${index}-with-id-${query.id}`}
                                className={`query-editor__item`}
                                >
                                <Button 
                                    icon={editableQuery ?
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
                                            setQuerySelect(query)
                                        }
                                        scrollToTop()
                                    }}
                                />
                                { editableQuery ? null :
                                    <Button 
                                        icon={IcoEdit}
                                        variant='second'
                                        className={'query-editor__item-edit-btn'}
                                        onClick={() => {
                                            setEditableQuery(query)
                                            scrollToTop()
                                        }}
                                    />
                                }
                            </div>
                        ))}
                    </> : null }

                    {queryOrTheme === 1 ? <>
                        {themeList.map((theme, index) => (
                            <div 
                                key={`query-${index}-with-id-${theme.id}`}
                                className={`query-editor__item`}
                                >
                                <Button 
                                    icon={editableQuery ?
                                        editableQuery.id === theme.id ? IcoBack : IcoEdit : IcoTag
                                    }
                                    text={theme.name}
                                    variant={((querySelect?.id === theme.id) || (editableQuery && editableQuery.id === theme.id)) ? 'first' : 'second'}
                                    className="query-editor__item-title"
                                    onClick={() => {
                                        if (editableQuery) {
                                            setEditableQuery(editableQuery.id === theme.id ? null : theme)
                                        } else {
                                            setVisible(false)
                                            loadTasksByTheme(`#${theme.name}`, theme.id)
                                        }
                                        scrollToTop()
                                    }}
                                />
                                { editableQuery ? null :
                                    <Button 
                                        icon={IcoEdit}
                                        variant='second'
                                        className={'query-editor__item-edit-btn'}
                                        onClick={() => {
                                            setEditableQuery(theme)
                                            scrollToTop()
                                        }}
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
                        setEditableQuery={value => setEditableQuery(value)}
                    />:null
                }
                { (editableQuery && queryOrTheme === 1) ?
                    <BlockThemeEditor 
                        title={editableQuery.id < 0 ? 'new theme' : `edit theme : ${editableQuery.id}`}
                        editable={editableQuery as TypeFilterNew}
                        updateEditable={(query: TypeFilterNew) => setEditableQuery(query)}
                        setEditableQuery={value => setEditableQuery(value)}
                    />:null
                }
            </div>
        </div>
    </Modal>
}

export default QueryEditor;