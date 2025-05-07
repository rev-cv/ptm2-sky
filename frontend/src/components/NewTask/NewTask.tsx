import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'
import useWebSocket from 'react-use-websocket'
import Button from '@comps/Button/Button'
import './style.scss'
import Logo from '@asset/cactus.svg'
import IcoMagic from '@asset/magic.svg'

function NewTask() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    const [taskId, setTaskId] = useState<string | null>(null)
    const [status, setStatus] = useState('idle')
    const [result, setResult] = useState<null|object>(null)
    const [taskText, setTaskText] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    
    // Соединяемся с WebSocket только когда у нас есть taskId
    const wsUrl = taskId ? `ws://localhost:3000/api/ws/${taskId}` : null;
    
    // Настройка WebSocket с правильной проверкой соединения
    const { lastMessage, readyState } = useWebSocket(wsUrl, {
        shouldReconnect: (closeEvent) => status === 'running',
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onError: (event) => {
            console.error('WebSocket error:', event);
            setStatus('error');
            setResult({ message: 'WebSocket connection failed' });
        },
        onOpen: () => console.log('WebSocket connected successfully'),
        onClose: (event) => console.log('WebSocket closed:', event),
    }, !!taskId); // Важно! Третий параметр указывает, что соединение должно быть активно только при наличии taskId

    // Логирование состояния WebSocket
    useEffect(() => {
        console.log('WebSocket readyState:', readyState, 'taskId:', taskId);
        if (readyState === 3 && status === 'running') {
            setStatus('disconnected');
            setResult({ message: 'WebSocket connection lost' });
        }
    }, [readyState, status]);

    // Обработка сообщений WebSocket
    useEffect(() => {
        if (lastMessage !== null) {
            console.log('Raw message:', lastMessage.data);
            try {
                const data = JSON.parse(lastMessage.data);
                console.log('Parsed data:', data);
                setStatus(data.status);
                if (data.result) {
                    setResult(data.result);
                }
            } catch (error) {
                console.error('Parse error:', error);
                setStatus('error');
                setResult({ message: 'Failed to parse WebSocket message' });
            }
        }
    }, [lastMessage]);

    // Запуск задачи
    const startTask = async () => {
        setStatus('starting');
        setResult(null);
        try {
            const response = await fetch('http://localhost:3000/api/generate_subtasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: taskText,
                    description: taskDescription
                })
            });
            
            if (!response.ok) throw new Error('Failed to start task');
            
            const data = await response.json();
            console.log('Task started:', data);
            
            // Сохраняем taskId для последующего подключения к WebSocket
            setTaskId(data.task_id);
            setStatus(data.status);
        } catch (error:any) {
            console.error('Start task error:', error);
            setStatus('error');
            setResult({ message: error.message || 'Failed to start task' });
        }
    };

    return (<>
        <div className="new-task__line">
            <div className='new-task__clater'>
                <div><Logo /></div>
            </div>
            <input 
                type="text"
                id="new-task-title"
                placeholder="Enter task..."
                className="new-task__task"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
            />
        </div>

        <textarea 
            name="new-task-descr"
            id="new-task-descr"
            className="new-task__descr"
            rows={5}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
        />

        <Button 
            className='new-task__btn-magic' 
            variant='ico' 
            onClick={startTask}
            disabled={status === 'running' || status === 'starting'}
        >
            <IcoMagic />
            <span>Magic</span>
        </Button>

        <p>Status: {status}</p>
        
        <div className="result-container">
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
        
    </>)
}

export default NewTask