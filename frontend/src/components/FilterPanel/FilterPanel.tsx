const APIURL = import.meta.env.VITE_API_URL;
import { useEffect } from "react";

import { filterFromServer } from '@utils/jotai.store'
import { useAtom } from "jotai"

import BlockActivation from "./BlockActivation"
import BlockTaskchecks from "./BlockTaskchecks"
import BlockDeadline from "./BlockDeadline"
import BlockCritical from "./BlockCritical"
import BlockAssoc from "./BlockAssoc"
import BlockState from "./BlockState";

import "./style.scss"

function FilterPanel (){

    const [filters, setFiltersWithServer] = useAtom(filterFromServer) 

    useEffect(() => {
        fetch(`${APIURL}/api/get_filters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                // обработка полученных фильтров
                console.log("filters from API:", data);
                setFiltersWithServer(data)
            })
            .catch(err => {
                console.error("Ошибка загрузки фильтров:", err);
            });
    }, []);

    return (
        <div className="filter-panel">

            <BlockActivation />
            <BlockDeadline />
            <BlockTaskchecks />
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
                        type_assoc="theme"
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
                        title="Типы действия"
                    /> 
            }

            {
                filters?.action_type && 
                    <BlockAssoc 
                        assoc_list={filters.energy_level}
                        type_assoc="energy_level"
                        title="Уровень энергии"
                    /> 
            }
        </div>
    )
}

export default FilterPanel;
