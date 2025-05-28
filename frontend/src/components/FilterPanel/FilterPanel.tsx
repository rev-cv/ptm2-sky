const APIURL = import.meta.env.VITE_API_URL;
import { useEffect } from "react";

import { filterFromServer } from '@utils/jotai.store'
import { useAtom } from "jotai"

import BlockActivation from "./BlockActivation";
import BlockTaskchecks from "./BlockTaskchecks";
import BlockDeadline from "./BlockDeadline";
import BlockActions from "./BlockActions";
import BlockEnergy from "./BlockEnergy";
import BlockThemes from "./BlockThemes";
import BlockCritical from "./BlockCritical";

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
                    <BlockThemes theme_list={filters.theme} /> 
            }
            
            <BlockActions />
            <BlockEnergy />

        </div>
    )
}

export default FilterPanel;

