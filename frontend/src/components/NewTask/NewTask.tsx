const APIURL = import.meta.env.VITE_API_URL;
const WSURL = import.meta.env.VITE_WS_URL;
import { useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { currentNewTask, resetTask } from '@utils/jotai.store'
import useWebSocket from 'react-use-websocket'

import Button from '@comps/Button/Button'
import Loader from '@comps/Loader/Loader'

import BlockThemes from './BlockThemes'
import BlockSubTasks from './BlockSubTasks'
import BlockStates from './BlockStates'
import BlockStress from './BlockStress'
import BlockCriticality from './BlockCriticality'
import BlockTiming from './BlockTiming'
import BlockAction  from './BlockActions';

import IcoLogo from '@asset/cactus.svg'
import IcoMagic from '@asset/magic.svg'
import IcoAdd from '@asset/add.svg'
import IcoClean from '@asset/clean.svg'
import './style.scss'


function NewTask () {
    
    const [fillingNewTask, updateNewTask] = useAtom(currentNewTask)
    const [isDoneMagic, setIsDoneMagic] = useState(false)

    const refTaskTitle = useRef<HTMLInputElement>(null);
    const refTaskDescr = useRef<HTMLTextAreaElement>(null);

    // реактивы отвечающие за магический запрос
    const [taskId, setTaskId] = useState<string | null>(null)
    const [status, setStatus] = useState('idle')
    
    // настройка WebSocket с проверкой соединения
    const { lastMessage } = useWebSocket(`${WSURL}/api/ws/${taskId}`, {
        shouldReconnect: () => status === 'running',
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onError: (event) => {
            console.error('WebSocket error:', event)
            setStatus('error')
            setTaskId(null)
        },
        onOpen: () => console.log('WebSocket connected successfully'),
        onClose: (event) => {
            console.log('WebSocket closed:', event)
            setTaskId(null)
            setStatus('idle')
        },
    }, !!taskId); // !!taskId указывает, что соединение должно быть активно только при наличии taskId

    // обработка сообщений WebSocket
    useEffect(() => {
        if (lastMessage !== null) {
            // console.log('Raw message:', lastMessage.data);
            try {
                const data = JSON.parse(lastMessage.data);
                // console.log('Parsed data:', data);
                setStatus(data.status);
                if (data.result) {
                    // setResult(data.result);
                    updateNewTask({...fillingNewTask, ...data.result})
                    console.log('Parsed result:', data.result);
                    setIsDoneMagic(true);
                    setTaskId(null); // сброс websocket соединения
                }
            } catch (error) {
                console.error('Parse error:', error);
                setStatus('error');
                // setResult({ "message": 'Failed to parse WebSocket message' });
            }
        }
    }, [lastMessage]);

    // запуск анализа задачи нейронкой
    const generateOptionsForTask = async () => {
        setStatus('starting');
        // setResult(null);
        try {
            const response = await fetch(`${APIURL}/api/generate_options_for_task`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: fillingNewTask.title,
                    description: fillingNewTask.description
                })
            });
            
            if (!response.ok) throw new Error('Failed to start task');
            
            const data = await response.json();
            console.log('Task started:', data);
            
            // сохранить taskId для последующего подключения к WebSocket
            setTaskId(data.task_id);
            setStatus(data.status);
        } catch (error:any) {
            console.error('Start task error:', error);
            setStatus('error');
            // setResult({ message: error.message || 'Failed to start task' });
        }
    }

    function clearForm () {
        console.log('clean')
        updateNewTask(resetTask)
        setTaskId(null)
        setStatus('idle')
        setIsDoneMagic(false)
        refTaskTitle.current?.focus()
    }

    async function createNewTask () {
        console.log("created new task")

        setStatus('creating');
        
        try {
            console.log(JSON.stringify({...fillingNewTask}))
            
            const activation = fillingNewTask.activation && new Date(fillingNewTask.activation).toISOString() 
            const deadline = fillingNewTask.deadline && new Date(fillingNewTask.deadline).toISOString() 
            const taskchecks = fillingNewTask.taskchecks?.map(strdate => (
                new Date(strdate).toISOString()
            ))

            const response = await fetch(`${APIURL}/api/create_new_task`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...fillingNewTask,
                    activation,
                    deadline,
                    taskchecks
                })
            });
            
            if (!response.ok) throw new Error('Failed to create task');
            
            const data = await response.json();
            console.log('Task created:', data);

            if (data.status === "created") clearForm()

        } catch (error:any) {
            console.error('Start task error:', error);
            setStatus('error');
        }
    }

    return (<>
        <div className="new-task__line">
            <div className='new-task__clater'>
                <div><IcoLogo/></div>
            </div>
            <input 
                id="new-task-title"
                type="text"
                ref={refTaskTitle}
                placeholder="Enter task..."
                className="new-task__task"
                value={fillingNewTask.title}
                onChange={(e) => {
                    updateNewTask({...fillingNewTask, title: e.target.value})
                }}
                onKeyUp={(e) => {
                    const valueLength = refTaskTitle.current ? refTaskTitle.current?.value.length : 0
                    if (e.key === 'Enter' && 5 < valueLength && refTaskDescr.current) {
                        refTaskDescr.current?.focus()
                    }
                }}
            />
        </div>

        <textarea 
            id="new-task-descr"
            ref={refTaskDescr}
            name="new-task-descr"
            className="new-task__descr"
            rows={5}
            value={fillingNewTask.description}
            onChange={(e) => {
                updateNewTask({...fillingNewTask, description: e.target.value})
            }}
        />

        {
            fillingNewTask.motivation?.length &&
                <div className="new-task__motivation">{fillingNewTask.motivation}</div>
        }

        <div className="new-task__options">
            <BlockSubTasks />
            <BlockTiming />
            <BlockCriticality />

            <div className="new-task__h5">Соответвия</div>
            
            <BlockThemes />
            <BlockStates />
            <BlockStress />
            <BlockAction />
        </div>

        <div className='new-task__btns'>
            {
                isDoneMagic ? 
                    <Button
                        text="Create task"
                        IconComponent={status === 'creating' ? Loader : IcoAdd }
                        className='new-task__btns-submit'
                        onClick={createNewTask}
                        disabled={status === 'creating'}
                    />
                : 5 < fillingNewTask.title.length &&
                    <Button
                        text="Magic"
                        IconComponent={status === 'running' || status === 'starting' ? Loader : IcoMagic }
                        className='new-task__btns-submit'
                        onClick={generateOptionsForTask}
                        disabled={status === 'running' || status === 'starting'}
                    />
            }

            <Button
                IconComponent={IcoClean}
                className='new-task__btns-clean'
                variant='second'
                onClick={clearForm}
            />

        </div>
        
    </>)
}

export default NewTask