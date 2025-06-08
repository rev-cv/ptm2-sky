import Button from '@comps/Button/Button'
import IcoClose from '@asset/close.svg'

type TypeBlockFilterPeriod = {
    title: string
    text: string
    Icon: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ComponentType<React.SVGProps<SVGSVGElement>>
    onDelete: () => void
}

function BlockFilter ({title, Icon, text, onDelete}:TypeBlockFilterPeriod) {

    return <div 
        className='search-component__filter' 
        onClick={e => e.stopPropagation()}
        title={title}
        >
            <div><Icon /></div>
            <div>{text}</div>
            <Button 
                IconComponent={IcoClose} 
                onClick={e => {
                    onDelete()
                    e.stopPropagation()
                }}
            />
    </div>
}

export default BlockFilter