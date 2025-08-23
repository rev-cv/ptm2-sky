import { atomGenMotive, useAtom } from "@utils/jotai.store";
import { Commands } from "@mytype/typesGen";

import TextArea from "@comps/TextArea/TextArea";
import Toggle from "@comps/Toggles/Toggle";

import IcoMagic from "@asset/magic.svg";
import IcoBack from "@asset/back.svg";
import Loader from "@comps/Loader/Loader";

type TypeDescrTask = {
    title?: string;
    descr?: string;
    motiv?: string;
    status?: boolean;
    id: number;
    created?: string;
    finished?: string;
    onChangeTitle: (title: string) => void;
    onChangeDescr: (descr: string) => void;
    onChangeMotiv: (descr: string) => void;
    onChangeStatus: (status: boolean) => void;
    onGenerate: (command: (typeof Commands)[keyof typeof Commands]) => void;
    onRollbackGenerate: (oldMotiv: string) => void;
};

function DescriptionTask({
    title = "",
    descr = "",
    motiv = "",
    status,
    id,
    created = "N/A",
    finished,
    onChangeTitle,
    onChangeDescr,
    onChangeMotiv,
    onChangeStatus,
    onGenerate,
    onRollbackGenerate,
}: TypeDescrTask) {
    const [genMotive, updateGenMotive] = useAtom(atomGenMotive);

    const hundleGenerate = () => {
        if (genMotive.isGen) {
            // остановка генерации
            updateGenMotive({ isGen: false, fixed: "" });
            onGenerate(Commands.STOP);
            return;
        }

        if (genMotive.fixed) {
            // откат после генерации
            onRollbackGenerate(genMotive.fixed);
            updateGenMotive({ isGen: false, fixed: "" });
            return;
        }

        // старт генерации
        updateGenMotive({ isGen: true, fixed: motiv });
        onGenerate(Commands.GEN_MOTIVE);
    };

    return (
        <div className="editor-task__block editor-block-main">
            {0 < id ? (
                <div className="editor-block-main__status">
                    <Toggle
                        elements={[
                            { label: "wait", value: 0, isActive: true },
                            { label: "done", value: 1, isActive: false },
                        ]}
                        activeValue={status ? 1 : 0}
                        onChange={(status) => onChangeStatus(0 < status)}
                    />
                </div>
            ) : null}

            <div className="editor-block-main__id">
                {id < 0
                    ? `Сreating a new task…`
                    : `${id}: created ${created} ${finished ? "- finished " + finished : ""}`}
            </div>

            <TextArea
                value={title}
                placeholder="Task title"
                className="editor-block-main__title"
                onChange={(e) => onChangeTitle(e.target.value)}
                isBanOnEnter={true}
            />

            <TextArea
                value={descr}
                label="description"
                className="editor-block-main__descr"
                onChange={(e) => onChangeDescr(e.currentTarget.value)}
            />

            <TextArea
                value={motiv}
                label="motivation"
                className="editor-block-main__descr"
                onChange={(e) => onChangeMotiv(e.currentTarget.value)}
                onGenerate={hundleGenerate}
                icoGen={
                    genMotive.isGen
                        ? Loader
                        : genMotive.fixed != ""
                          ? IcoBack
                          : IcoMagic
                }
            />
        </div>
    );
}

export default DescriptionTask;
