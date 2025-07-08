import { loadFilters } from '@api/loadFilters'
import { useEffect } from "react";

import { filterFromServer } from '@utils/jotai.store'
import { useAtomValue } from "jotai"

import BlockCritical from "./BlockCritical"
import BlockAssoc from "./BlockAssoc"
import BlockState from "./BlockState";
import BlockFilterDates from "./BlockFilterDates"

import "./style.scss"

function FilterPanel (){

    const filters = useAtomValue(filterFromServer) 

    useEffect(() => loadFilters(), [])

    return (
        <div className="filter-panel">

            <BlockFilterDates title="Активация" period_type="activation"/>
            <BlockFilterDates title="Дедлайн" period_type="deadline"/>
            <BlockFilterDates title="Даты проверок" period_type="taskchecks"/>

            <BlockCritical />

            { 
                filters?.theme && 
                    <BlockAssoc 
                        assoc_list={filters.theme}
                        type_assoc="theme"
                        title={`Темы`}
                    />
            }

            { 
                filters?.state && 
                    <BlockState 
                        state_dict={filters.state}
                        type_assoc="state"
                        title="Состояния"
                    />
            }

            {
                filters?.stress && 
                    <BlockAssoc 
                        assoc_list={filters.stress}
                        type_assoc="stress"
                        title="Эмоциональная нагрузка"
                    />
            }

            {
                filters?.action_type && 
                    <BlockAssoc 
                        assoc_list={filters.action_type}
                        type_assoc="action_type"
                        title="Типы требуемых действий"
                    />
            }
        </div>
    )
}

export default FilterPanel;
