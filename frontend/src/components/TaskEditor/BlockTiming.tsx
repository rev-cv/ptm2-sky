import { useState } from "react";
import ButtonCalendar from "@comps/ButtonCalendar/ButtonCalendar";
import Button from "@comps/Button/Button";
import { sortDateStrings } from "@utils/date-funcs";

import IcoStart from "@asset/start.svg";
import IcoCheck from "@asset/check.svg";
import IcoAdd from "@asset/add.svg";

type TypeProps = {
    deadline: string | null;
    activation: string | null;
    taskchecks: string[];
    updateDeadline: (ds: string) => void;
    updateActivation: (ds: string) => void;
    updateTaskchecks: (ds: string[]) => void;
};

function BlockTiming({
    deadline,
    activation,
    taskchecks,
    updateDeadline,
    updateActivation,
    updateTaskchecks,
}: TypeProps) {
    const [emptyTaskChecks, setEmptyTaskChecks] = useState<string[]>([]);

    const tch = sortDateStrings(taskchecks);

    return (
        <div className="editor-task__block editor-block-timing">
            <div className="editor-block-timing__title">
                <IcoStart />
                <span>Дата активации</span>
            </div>

            <div className="editor-block-timing__descr">
                Дата, когда задача становится активной и доступной для
                выполнения.
            </div>

            <ButtonCalendar
                date={activation}
                onClickDay={(value) => updateActivation(value)}
            />

            <div className="editor-block-timing__d"></div>

            <div className="editor-block-timing__title ico-deadline">
                <IcoStart />
                <span>Дата дедлайна</span>
            </div>

            <div className="editor-block-timing__descr">
                Крайний срок, к которому задача должна быть завершена.
            </div>

            <ButtonCalendar
                date={deadline}
                onClickDay={(value) => updateDeadline(value)}
            />

            <div className="editor-block-timing__d"></div>

            <div className="editor-block-timing__title">
                <IcoCheck />
                <span>Даты напоминаний</span>
            </div>

            <div className="editor-block-timing__descr">
                Даты, когда запланированы напоминания или проверки прогресса по
                задаче.
            </div>

            {tch.map((ds, index) => (
                <ButtonCalendar
                    date={ds}
                    onClickDay={(value) => {
                        let ntsd = [...taskchecks];
                        if (value === "") {
                            ntsd.splice(index, 1);
                        } else {
                            ntsd[index] = value;
                        }
                        updateTaskchecks(sortDateStrings(ntsd));
                    }}
                    key={`modal-edit-task__taskchecks:${index}`}
                />
            ))}

            {emptyTaskChecks.map((ds, index) => (
                <ButtonCalendar
                    date={ds}
                    onClickDay={(value) => {
                        setEmptyTaskChecks(emptyTaskChecks.splice(index, 1));
                        if (value != "") {
                            updateTaskchecks(sortDateStrings([...tch, value]));
                        }
                    }}
                    key={`emptyTaskChecks:${index}`}
                />
            ))}

            <Button
                icon={IcoAdd}
                onClick={() => setEmptyTaskChecks([...emptyTaskChecks, ""])}
                title="add new subtask"
            />
        </div>
    );
}

export default BlockTiming;
