import { PagesForUserEditor as Page } from "@mytype/typesUser";

import IcoUser from "@asset/user.svg";
import IcoDanger from "@asset/danger.svg";
import IcoBell from "@asset/bell.svg";
import IcoInterface from "@asset/interface.svg";
import IcoIntegration from "@asset/integration.svg";
import IcoData from "@asset/data.svg";

type TypeAsideButton = [
    string,
    number,
    string | React.FunctionComponent<any> | React.ComponentType<any>,
];

export const asideButtons: TypeAsideButton[] = [
    ["Аккаунт", Page.ACCOUNT, IcoUser],
    ["Безопасность", Page.SAFETY, IcoDanger],
    ["Уведомления", Page.NOTIFICATION, IcoBell],
    ["Внешний вид", Page.APPEARANCE, IcoInterface],
    ["Интеграции", Page.INTEGRATION, IcoIntegration],
    ["Данные и экспорт", Page.DATA, IcoData],
];

type TypeProps = {
    activeTab: number;
    onChangeTab: (activeTab: number) => void;
};

function BlockMenu({ activeTab, onChangeTab }: TypeProps) {
    return (
        <div className="editor-user__menu">
            {asideButtons.map((item, index) => {
                const Icon = item[2];
                return (
                    <button
                        className={item[1] === activeTab ? "active" : ""}
                        onClick={() => onChangeTab(item[1])}
                        key={`editor-user-menu-${index}=${item[1]}`}
                    >
                        <Icon /> {item[0]}
                    </button>
                );
            })}
        </div>
    );
}

export default BlockMenu;
