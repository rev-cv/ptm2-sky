import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { openSidePanel, currentNewTask } from '@utils/jotai.store'
import useWebSocket from 'react-use-websocket'
import Button from '@comps/Button/Button'
import Loader from '@comps/Loader/Loader'
import SubTask from '@comps/NewTask/SubTaskElement'
import ThemeElement from '@comps/NewTask/ThemeElement'
import './style.scss'
import '@comps/Accordion/Accordion.scss'
import IcoLogo from '@asset/cactus.svg'
import IcoMagic from '@asset/magic.svg'
import IcoPoint from '@asset/point.svg'

function NewTask () {
    const [currentOpenPanel] = useAtom(openSidePanel)
    const [fillingNewTask, updateNewTask] = useAtom(currentNewTask)

    // основной текст задачи
    const [taskTitle, setTitle] = useState('');
    const [taskDescr, setDescr] = useState('');

    // разворот аккардеонов
    const [isOpenSubTasks, setStatusSubTasks] = useState(true);
    const [isOpenThemes, setStatusThemes] = useState(true);

    // реактивы отвечающие за магический запрос
    const [taskId, setTaskId] = useState<string | null>(null)
    const [status, setStatus] = useState('idle')
    
    // настройка WebSocket с проверкой соединения
    const { lastMessage } = useWebSocket(`ws://localhost:3000/api/ws/${taskId}`, {
        shouldReconnect: () => status === 'running',
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onError: (event) => {
            console.error('WebSocket error:', event);
            setStatus('error');
            // setResult({ "message": 'WebSocket connection failed' });
        },
        onOpen: () => console.log('WebSocket connected successfully'),
        onClose: (event) => console.log('WebSocket closed:', event),
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
                }
            } catch (error) {
                console.error('Parse error:', error);
                setStatus('error');
                // setResult({ "message": 'Failed to parse WebSocket message' });
            }
        }
    }, [lastMessage]);

    // запуск задачи
    const startTask = async () => {
        setStatus('starting');
        // setResult(null);
        try {
            const response = await fetch('http://localhost:3000/api/generate_subtasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: taskTitle,
                    description: taskDescr
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
    };

    // очистка формы ввода 
    useEffect(() => {
        // при открытии форма автоматически очищается если был очищен fillingNewTask
        if (currentOpenPanel === 'left') {
            setTitle(fillingNewTask.title);
            setDescr(fillingNewTask.description);
        }
    }, [currentOpenPanel]);

    return (<>
        <div className="new-task__line">
            <div className='new-task__clater'>
                <div><IcoLogo/></div>
            </div>
            <input 
                type="text"
                id="new-task-title"
                placeholder="Enter task..."
                className="new-task__task"
                value={taskTitle}
                onChange={(e) => {
                    setTitle(e.target.value)
                    updateNewTask({...fillingNewTask, title: e.target.value})
                }}
            />
        </div>

        <textarea 
            name="new-task-descr"
            id="new-task-descr"
            className="new-task__descr"
            rows={5}
            value={taskDescr}
            onChange={(e) => {
                setDescr(e.target.value)
                updateNewTask({...fillingNewTask, description: e.target.value})
            }}
        />

        {
            fillingNewTask.motivation?.length &&
            <div className="new-task__motivation">{fillingNewTask.motivation}</div>
        }

        <div className="new-task__options">
            {
                fillingNewTask.match_themes?.length &&

                <div className={`accordion${isOpenSubTasks ? " view" : ""}`}>
                    <div 
                        className='new-task__h4 accordion__title' 
                        onClick={() => setStatusSubTasks(!isOpenSubTasks)}
                        >
                        <div className="accordion__pointer"><IcoPoint /></div>
                        <span>Подзадачи</span>
                    </div>
                    <div className="accordion__options">
                        <div className="accordion__options-sub">
                            { fillingNewTask.subtasks?.map(elem => <SubTask {...elem} /> ) }
                        </div>
                    </div>
                </div>
            }

            {
                (fillingNewTask.match_themes?.length || fillingNewTask.new_themes?.length) && 

                <div className={`accordion${isOpenThemes ? " view" : ""}`}>
                    <div 
                        className='new-task__h4 accordion__title' 
                        onClick={() => setStatusThemes(!isOpenThemes)}
                        >
                        <div className="accordion__pointer"><IcoPoint /></div>
                        <span>Добавить в темы</span>
                    </div>
                    <div className="accordion__options">
                        <div className="accordion__options-sub">
                            {
                                fillingNewTask.match_themes?.length && 
                                    fillingNewTask.match_themes?.map(elem => <ThemeElement {...elem} /> )
                            }
                            {
                                fillingNewTask.new_themes?.length && 
                                    <>
                                        <div className='new-task__theme-elem-add-new'>новые темы</div>
                                        {
                                            fillingNewTask.new_themes?.map(elem => <ThemeElement {...elem} /> )
                                        }
                                    </>
                                    
                            }
                        </div>
                    </div>
                </div>
            }
            
            
        </div>

        <Button 
            className='new-task__btn-magic' 
            variant='ico' 
            onClick={startTask}
            disabled={status === 'running' || status === 'starting'}
            >
            {status === 'running' || status === 'starting' ? <Loader /> : <IcoMagic />}
            <span>Magic</span>
        </Button>       
    </>)
}

export default NewTask