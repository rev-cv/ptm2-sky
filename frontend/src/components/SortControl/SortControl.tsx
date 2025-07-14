import { useState } from 'react'
import './style.scss'

import { TypeSortOption } from '@mytype/typeSaveQueries'

import CheckBox from '@comps/CheckBox/CheckBox'

import IcoGrid from '@asset/grid.svg'
import IcoBack from '@asset/back.svg'

type TypeProps = {
    list: TypeSortOption[]
    onChange: (sort: TypeSortOption[]) => void
}

type TypeSortPoint = {
    label: string
    asc: TypeSortOption
    desc: TypeSortOption
}

const sortPoints:TypeSortPoint[] = [
    { label: "Дата создания", asc: "created_asc", desc: "created_desc" },
    { label: "Дата дедлайна", asc: "deadline_asc", desc: "deadline_desc" },
    { label: "Дата активации", asc: "activation_asc", desc: "activation_desc" },
    { label: "Название", asc: "name_asc", desc: "name_desc" },
    { label: "Риск", asc: "risk_asc", desc: "risk_desc" },
    { label: "Последствия", asc: "impact_asc", desc: "impact_desc" }
]

function SortControl ({list, onChange}:TypeProps) {
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

    // текущий порядок сортировки по list
    const sortedPoints = [...sortPoints].sort((a, b) => {
        const aIdx = Math.min(
            list.indexOf(a.asc) !== -1 ? list.indexOf(a.asc) : 99,
            list.indexOf(a.desc) !== -1 ? list.indexOf(a.desc) : 99
        )
        const bIdx = Math.min(
            list.indexOf(b.asc) !== -1 ? list.indexOf(b.asc) : 99,
            list.indexOf(b.desc) !== -1 ? list.indexOf(b.desc) : 99
        )
        return aIdx - bIdx
    })

    const handleDragStart = (idx: number) => {
        setDraggedIdx(idx)
    }

    const handleDragOver = (idx: number, e: React.DragEvent) => {
        e.preventDefault()
        setDragOverIdx(idx)
    }

    const handleDrop = (idx: number) => {
        if (draggedIdx === null || draggedIdx === idx) {
            setDraggedIdx(null)
            setDragOverIdx(null)
            return
        }
        // определить, какой элемент перемещаем
        const draggedPoint = sortedPoints[draggedIdx]
        // определить, какой ключ сейчас активен (asc или desc)
        const activeKey = list.includes(draggedPoint.asc)
            ? draggedPoint.asc
            : list.includes(draggedPoint.desc)
                ? draggedPoint.desc
                : null
        if (!activeKey) {
            setDraggedIdx(null)
            setDragOverIdx(null)
            return
        }
        // удалить из текущего списка и вставить на новое место
        const filtered = list.filter(v => v !== draggedPoint.asc && v !== draggedPoint.desc)
        const insertIdx = filtered.findIndex(v => {
            const point = sortedPoints[idx]
            return v === point.asc || v === point.desc
        })
        let newList
        if (insertIdx === -1) {
            newList = [...filtered, activeKey]
        } else {
            newList = [
                ...filtered.slice(0, insertIdx),
                activeKey,
                ...filtered.slice(insertIdx)
            ]
        }
        onChange(newList)
        setDraggedIdx(null)
        setDragOverIdx(null)
    }

    const handleDragEnd = () => {
        setDraggedIdx(null)
        setDragOverIdx(null)
    }

    return <div className='sort-control'>
        {sortedPoints.map((point, index) => {
            const isActive = list.includes(point.asc) || list.includes(point.desc)
            const isAsc = list.indexOf(point.asc)
            const isDesc = list.indexOf(point.desc)
            const position = isAsc !== -1 ? isAsc : isDesc !== -1 ? isDesc : 10

            return <div 
                className={`sort-control__item${dragOverIdx === index ? ' drag-over' : ''}${isActive ? "" : " not-active"}`}
                key={`sort-control-item-${index}`}
                style={{order: position}}
                draggable={isActive}
                onDragStart={() => handleDragStart(index)}
                onDragOver={e => {
                    if (draggedIdx !== index) {
                        handleDragOver(index, e)
                        e.currentTarget.classList.add("drag-over")
                    }
                }}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                >
                <div className="sort-control__grab"><IcoGrid /></div>

                <CheckBox 
                    title={isActive ? 'on' : 'off'}
                    state={isActive}
                    className='sort-control__on-off'
                    onChangeStatus={(status) => {
                        if (status) {
                            if (list.includes(point.asc)) {
                                onChange(list.filter(v => v !== point.asc))
                            } else if (list.includes(point.desc)) {
                                onChange(list.filter(v => v !== point.desc))
                            } else {
                                onChange([...list, point.asc])
                            }
                        } else {
                            onChange(list.filter(v => v !== point.asc && v !== point.desc))
                        }
                    }}
                />
                
                <div
                    className='sort-control__title'
                    onClick={() => {}}
                    >{point.label}
                </div>

                <button 
                    className={`sort-control__asc-desc${(isAsc !== -1 || !isActive) ? " asc" : " desc"}`}
                    onClick={() => {
                        if (!isActive) return
                        if (isAsc !== -1) {
                            onChange([
                                ...list.slice(0, isAsc),
                                point.desc,
                                ...list.slice(isAsc + 1)
                            ])
                        } else if (isDesc !== -1) {
                            onChange([
                                ...list.slice(0, isDesc),
                                point.asc,
                                ...list.slice(isDesc + 1)
                            ])
                        } else {
                            onChange([...list, point.asc])
                        }
                    }}
                    title={isActive ? isAsc !== -1 ? "ASC" : "DESC" : ""}
                    ><IcoBack/>
                </button>
            </div>
        })}
    </div>
}

export default SortControl