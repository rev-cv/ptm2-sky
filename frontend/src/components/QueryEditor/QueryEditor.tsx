import './style.scss'
import { useState } from 'react'

import { useAtomValue, queryAllTasks, atomQuerySelect, atomQueryList } from '@utils/jotai.store'

import Modal from '@comps/Modal/Modal'
import Button from '@comps/Button/Button'

import IcoQuery from '@asset/query.svg'
import IcoEdit from '@asset/edit.svg'
import IcoAdd from '@asset/add.svg'

type TypeProps = {
    onExit?: () => void
}

function QueryEditor({onExit}:TypeProps) {
    const [visible, setVisible] = useState(true)
    const [isOpenEditor, setEditorStatus] = useState(false)
    const queryList = useAtomValue(atomQueryList)
    const querySelect = useAtomValue(atomQuerySelect)

    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(false)}
            onExited={() => {
                if (onExit) onExit()
                setVisible(true)
            }}
            className={`modal-query-editor${isOpenEditor ? ' modal-query-editor--open' : ''}`}
        >
            <div className={`query-editor${isOpenEditor ? ' query-editor--open' : ''}`}>
                <div className="query-editor__list">
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
                    <span/>
                    {
                        queryList.map((query, index) => (
                            <div 
                                key={`query-${index}-with-id-${query.id}`}
                                className={`query-editor__item`}
                            >
                                <Button 
                                    IconComponent={IcoQuery}
                                    text={query.name}
                                    variant={querySelect?.id === query.id ? 'first' : 'second'}
                                    className="query-editor__item-title"
                                />
                                <Button 
                                    IconComponent={IcoEdit}
                                    variant='second'
                                    className={'query-editor__item-edit-btn'}
                                />
                            </div>
                        ))
                    }
                    <Button
                        IconComponent={IcoAdd}
                        variant='first'
                        onClick={() => setEditorStatus(!isOpenEditor)}
                        className="query-editor__new-query"
                    />
                </div>
                <div className="query-editor__editor"><div>
                    Введите ваш запрос здесь...
                </div></div>
            </div>
        </Modal>
    );
}

export default QueryEditor;