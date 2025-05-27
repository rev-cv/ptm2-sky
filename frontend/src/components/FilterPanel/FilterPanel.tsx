import BlockActivation from "./BlockActivation";
import BlockTaskchecks from "./BlockTaskchecks";
import BlockDeadline from "./BlockDeadline";
import BlockActions from "./BlockActions";
import BlockEnergy from "./BlockEnergy";
import BlockThemes from "./BlockThemes";
import BlockCritical from "./BlockCritical";

import "./style.scss"


function FilterPanel (){

    return (
        <div className="filter-panel">

            <BlockActivation />
            <BlockDeadline />
            <BlockTaskchecks />
            <BlockCritical />
            <BlockThemes />
            <BlockActions />
            <BlockEnergy />

            <div>Активация задачи</div>
            <div>активирована</div>
            <div>период</div>

            <div>дедлайн</div>
            <div>сегодня</div>
            <div>завтра</div>
            <div>эта неделя</div>
            <div>этот месяц </div>
            <div>период</div>

            <div>проверка</div>
            <div>сегодня</div>
            <div>завтра</div>
            <div>эта неделя</div>
            <div>этот месяц </div>
            <div>период</div>

            <div>Темы</div>
            <div>тема 1</div>
            <div>тема 2</div>
            <div>тема 3</div>
            <div>тема 3</div>
            <div>тема 3</div>
            <div>тема 3</div>
            <div>тема 3</div>
            <div>тема 3</div>
        </div>
    )
}

export default FilterPanel;

