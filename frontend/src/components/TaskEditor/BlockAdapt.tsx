import Toggle from '@comps/Toggles/Toggle'
import valuesForComponents from '@api/valuesForComponents.json'
import { TypeTasks_RI } from '@mytype/typeTask'

export type TypeAdaptValues = [typeof valuesForComponents.adapt.stress, (v: TypeTasks_RI) => void, TypeTasks_RI]

type TypeProps = {
    description: string
    points: TypeAdaptValues[]
}

function BlockAdapt ({description, points}:TypeProps) {

    return <div className='editor-task__block editor-block-adapt'>

        <div className='editor-block-adapt__descr'>
            {description}
        </div>

        { points.map(([obj, onChangeToggle, value], index) => (
            <div className='editor-block-adapt__point' key={`adapt-subblock-${index}+${value}`}>
                <div className='editor-block-adapt__title'>
                    <span>{obj.title}</span>
                </div>

                <div className="editor-block-adapt__descr">
                    <span>{obj.description}</span>
                </div>

                <Toggle
                    elements={obj.points}
                    activeValue={value}
                    onChange={v => onChangeToggle(v as TypeTasks_RI)}
                />

                <div className="editor-block-adapt__descr">
                    <span>{obj.points.find(item => item.value === value)?.description}</span>
                </div>
            </div>
        ))}
        
    </div>
}

export default BlockAdapt