import { SetStateAction } from "jotai";
import { TypeViewTask, TypeTasks_RI } from "@mytype/typeTask";
import { TypeFilterNew } from "@mytype/typeFilters";
import { PagesForTaskEditor as Page } from "@mytype/typeTask";
import valuesForComponents from "@api/valuesForComponents.json";

import BlockMain from "./BlockMain";
import BlockSubTasks from "./BlockSubTasks";
import BlockTiming from "./BlockTiming";
import BlockRisk from "./BlockRisk";
import BlockFilters from "./BlockFilters";
import BlockAdapt, { TypeAdaptValues } from "./BlockAdapt";

import { formatDateString } from "@utils/date-funcs";

import { wsCommander } from "@api/generateTask";

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

type TypeProps = {
    task: TypeViewTask;
    updateTask: SetAtom<[SetStateAction<TypeViewTask>], void>;
    activeTab: (typeof Page)[keyof typeof Page];
    allFilters?: TypeFilterNew[] | undefined;
};

const PageSelector = ({
    task,
    updateTask,
    activeTab,
    allFilters,
}: TypeProps): React.ReactNode | null => {
    switch (activeTab) {
        case Page.MAIN:
            return (
                <BlockMain
                    id={task.id}
                    title={task.title}
                    descr={task.description}
                    motiv={task.motivation}
                    status={task.status}
                    created={formatDateString(task.created_at)}
                    onChangeTitle={(t) =>
                        updateTask((prev) => ({ ...prev, title: t }))
                    }
                    onChangeDescr={(d) =>
                        updateTask((prev) => ({ ...prev, description: d }))
                    }
                    onChangeMotiv={(m) =>
                        updateTask((prev) => ({ ...prev, motivation: m }))
                    }
                    onChangeStatus={(s) =>
                        updateTask((prev) => ({ ...prev, status: s }))
                    }
                    onGenerate={async (command) => {
                        const newTask = await wsCommander(command, task);
                        if (!newTask) return;
                        updateTask((prev) => ({
                            ...prev,
                            motivation: newTask.motivation,
                        }));
                    }}
                    onRollbackGenerate={(oldMotive) => {
                        updateTask((prev) => ({
                            ...prev,
                            motivation: oldMotive,
                        }));
                    }}
                />
            );
        case Page.STEP:
            return (
                <BlockSubTasks
                    subtasks={task.subtasks}
                    onUpdate={(newOrder) =>
                        updateTask((prev) => ({ ...prev, subtasks: newOrder }))
                    }
                    onGenerate={async (command) => {
                        const newTask = await wsCommander(command, task);
                        if (!newTask) return;
                        updateTask((prev) => ({
                            ...prev,
                            subtasks: [...newTask.subtasks],
                        }));
                    }}
                    onRollbackGenerate={(oldMotive) => {
                        updateTask((prev) => ({
                            ...prev,
                            subtasks: [...oldMotive],
                        }));
                    }}
                />
            );
        case Page.TIME:
            return (
                <BlockTiming
                    deadline={task.deadline}
                    activation={task.activation}
                    taskchecks={task.taskchecks}
                    updateDeadline={(date) =>
                        updateTask((prev) => ({ ...prev, deadline: date }))
                    }
                    updateActivation={(date) =>
                        updateTask((prev) => ({ ...prev, activation: date }))
                    }
                    updateTaskchecks={(dates) =>
                        updateTask((prev) => ({ ...prev, taskchecks: dates }))
                    }
                />
            );
        case Page.RISK:
            return (
                <BlockRisk
                    risk={task.risk}
                    risk_proposals={task.risk_proposals}
                    risk_explanation={task.risk_explanation}
                    impact={task.impact}
                    onChangeRisk={(r) =>
                        updateTask((prev) => ({ ...prev, risk: r }))
                    }
                    onChangeImpact={(i) =>
                        updateTask((prev) => ({ ...prev, impact: i }))
                    }
                    onChangeProp={(text) =>
                        updateTask((prev) => ({
                            ...prev,
                            risk_proposals: text,
                        }))
                    }
                    onChangeExpl={(text) =>
                        updateTask((prev) => ({
                            ...prev,
                            risk_explanation: text,
                        }))
                    }
                    onGenerate={async (command) => {
                        const newTask = await wsCommander(command, task);
                        if (!newTask) return;
                        updateTask((prev) => ({
                            ...prev,
                            risk: newTask.risk,
                            risk_proposals: newTask.risk_proposals,
                            risk_explanation: newTask.risk_explanation,
                        }));
                    }}
                    onRollbackGenerate={(oldRisk) => {
                        updateTask((prev) => ({
                            ...prev,
                            risk: oldRisk.risk,
                            risk_proposals: oldRisk.risk_proposals,
                            risk_explanation: oldRisk.risk_explanation,
                        }));
                    }}
                />
            );
        case Page.THEME:
            return (
                <BlockFilters
                    curList={task.themes}
                    allList={allFilters ? allFilters : []}
                    type="theme"
                    isTheme={true}
                    onAddElement={(elem) => {
                        updateTask((prev) => ({
                            ...prev,
                            themes: [...prev.themes, elem],
                        }));
                    }}
                    onDelElement={(id) => {
                        updateTask((prev) => ({
                            ...prev,
                            themes: prev.themes.filter(
                                (elem) => elem.idf != id,
                            ),
                        }));
                    }}
                    onUpdateElement={(el) => {
                        updateTask((prev) => ({
                            ...prev,
                            themes: prev.themes.map((elem) =>
                                elem.idf != el.idf ? elem : el,
                            ),
                        }));
                    }}
                    onGenerate={async (command) => {
                        const newTask = await wsCommander(command, task);
                        if (!newTask?.themes) return;
                        // нужна проверка на то, что id не добавленных ассоциаций эксклюзивны
                        let contNotAdded = 0;
                        const ntc = [...task.themes, ...newTask.themes].map(
                            (elem) => {
                                if (elem.id < 0) {
                                    contNotAdded -= 1;
                                    elem.id = contNotAdded;

                                    if (elem.idf < 0) {
                                        elem.idf = contNotAdded;
                                    }
                                }
                                return elem;
                            },
                        );
                        updateTask((prev) => ({ ...prev, themes: ntc }));
                    }}
                    onRollbackGenerate={(oldTheme) => {
                        updateTask((prev) => ({ ...prev, themes: oldTheme }));
                    }}
                />
            );
        case Page.ACTION:
            return (
                <BlockFilters
                    curList={task.actions}
                    allList={allFilters ? allFilters : []}
                    type="action"
                    onAddElement={(elem) => {
                        updateTask((prev) => ({
                            ...prev,
                            actions: [...prev.actions, elem],
                        }));
                    }}
                    onDelElement={(id) => {
                        updateTask((prev) => ({
                            ...prev,
                            actions: prev.actions.filter(
                                (elem) => elem.idf != id,
                            ),
                        }));
                    }}
                    onUpdateElement={(el) => {
                        updateTask((prev) => ({
                            ...prev,
                            actions: prev.actions.map((elem) =>
                                elem.idf != el.idf ? elem : el,
                            ),
                        }));
                    }}
                    onGenerate={async (command) => {
                        const newTask = await wsCommander(command, task);
                        if (!newTask?.actions) return;
                        updateTask((prev) => ({
                            ...prev,
                            actions: newTask.actions,
                        }));
                    }}
                    onRollbackGenerate={(oldActions) => {
                        updateTask((prev) => ({
                            ...prev,
                            actions: oldActions,
                        }));
                    }}
                />
            );
        case Page.ADAPT:
            const pointAdapt: TypeAdaptValues[] = [
                [
                    valuesForComponents.adapt.stress,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, stress: v })),
                    task.stress,
                ],
                [
                    valuesForComponents.adapt.apathy,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, apathy: v })),
                    task.apathy,
                ],
                [
                    valuesForComponents.adapt.motivational,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, motivational: v })),
                    task.motivational,
                ],
                [
                    valuesForComponents.adapt.meditative,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, meditative: v })),
                    task.meditative,
                ],
                [
                    valuesForComponents.adapt.comfort,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, comfort: v })),
                    task.comfort,
                ],
                [
                    valuesForComponents.adapt.automaticity,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, automaticity: v })),
                    task.automaticity,
                ],
                [
                    valuesForComponents.adapt.significance,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, significance: v })),
                    task.significance,
                ],
            ];
            return (
                <BlockAdapt
                    description={valuesForComponents.adapt.description}
                    points={pointAdapt}
                />
            );
        case Page.INTENSITY:
            const pointIntensity: TypeAdaptValues[] = [
                // ! имеет значение последовательность расположения
                [
                    valuesForComponents.intensity.financial,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, financial: v })),
                    task.financial,
                ],
                [
                    valuesForComponents.intensity.temporal,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, temporal: v })),
                    task.temporal,
                ],
                [
                    valuesForComponents.intensity.physical,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, physical: v })),
                    task.physical,
                ],
                [
                    valuesForComponents.intensity.intellectual,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, intellectual: v })),
                    task.intellectual,
                ],
                [
                    valuesForComponents.intensity.emotional,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, emotional: v })),
                    task.emotional,
                ],
                [
                    valuesForComponents.intensity.social,
                    (v: TypeTasks_RI) =>
                        updateTask((prev) => ({ ...prev, social: v })),
                    task.social,
                ],
            ];
            return (
                <BlockAdapt
                    description={valuesForComponents.intensity.description}
                    points={pointIntensity}
                    isIntensity={true}
                    onGenerate={async (command) => {
                        const nt = await wsCommander(command, task);
                        if (!nt) return;
                        updateTask((prev) => ({
                            ...prev,
                            physical: nt.physical ? nt.physical : prev.physical,
                            intellectual: nt.intellectual
                                ? nt.intellectual
                                : prev.intellectual,
                            emotional: nt.emotional
                                ? nt.emotional
                                : prev.emotional,
                            social: nt.social ? nt.social : prev.social,
                            financial: nt.financial
                                ? nt.financial
                                : prev.financial,
                            temporal: nt.temporal ? nt.temporal : prev.temporal,
                        }));
                    }}
                    onRollbackGenerate={(oldInten) => {
                        updateTask((prev) => ({
                            ...prev,
                            physical: oldInten.fixed.physical
                                ? oldInten.fixed.physical
                                : prev.physical,
                            intellectual: oldInten.fixed.intellectual
                                ? oldInten.fixed.intellectual
                                : prev.intellectual,
                            emotional: oldInten.fixed.emotional
                                ? oldInten.fixed.emotional
                                : prev.emotional,
                            social: oldInten.fixed.social
                                ? oldInten.fixed.social
                                : prev.social,
                            financial: oldInten.fixed.financial
                                ? oldInten.fixed.financial
                                : prev.financial,
                            temporal: oldInten.fixed.temporal
                                ? oldInten.fixed.temporal
                                : prev.temporal,
                        }));
                    }}
                />
            );
        default:
            return null;
    }
};

export default PageSelector;
