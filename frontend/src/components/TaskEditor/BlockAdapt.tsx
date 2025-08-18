import valuesForComponents from "@api/valuesForComponents.json";
import { TypeTasks_RI } from "@mytype/typeTask";
import { TypeGenIntensity } from "@mytype/typesGen";
import { atomGenIntensity, useAtom } from "@utils/jotai.store";
import { Commands } from "@mytype/typesGen";

import Button from "@comps/Button/Button";
import Toggle from "@comps/Toggles/Toggle";

import IcoMagic from "@asset/magic.svg";
import IcoBack from "@asset/back.svg";
import Loader from "@comps/Loader/Loader";

export type TypeAdaptValues = [
    typeof valuesForComponents.adapt.stress,
    (v: TypeTasks_RI) => void,
    TypeTasks_RI,
];

type TypeProps = {
    description: string;
    points: TypeAdaptValues[];
    isIntensity?: boolean;
    onGenerate?: (command: (typeof Commands)[keyof typeof Commands]) => void;
    onRollbackGenerate?: (oldInten: TypeGenIntensity) => void;
};

function BlockAdapt({
    description,
    points,
    isIntensity = false,
    onGenerate,
    onRollbackGenerate,
}: TypeProps) {
    const [genInten, updateGenInten] = useAtom(atomGenIntensity);

    const hundleGenerate = () => {
        if (genInten.isGen) {
            // остановка генерации
            updateGenInten({ isGen: false, fixed: {} });
            onGenerate && onGenerate(Commands.STOP);
            return;
        }

        if (0 < Object.keys(genInten.fixed).length) {
            // откат после генерации
            onRollbackGenerate && onRollbackGenerate(genInten);
            updateGenInten({ isGen: false, fixed: {} });
            return;
        }

        // старт генерации
        const inten = {
            physical: points[2][2],
            intellectual: points[3][2],
            emotional: points[4][2],
            social: points[5][2],
            financial: points[0][2],
            temporal: points[1][2],
        };
        updateGenInten({ isGen: true, fixed: inten });
        onGenerate && onGenerate(Commands.GEN_INTENSITY);
    };

    return (
        <div className="editor-task__block editor-block-adapt">
            <div className="editor-block-adapt__descr">{description}</div>

            {points.map(([obj, onChangeToggle, value], index) => (
                <div
                    className="editor-block-adapt__point"
                    key={`adapt-subblock-${index}+${value}`}
                >
                    <div className="editor-block-adapt__title">
                        <span>{obj.title}</span>
                    </div>

                    <div className="editor-block-adapt__descr">
                        <span>{obj.description}</span>
                    </div>

                    <Toggle
                        elements={obj.points}
                        activeValue={value}
                        onChange={(v) => onChangeToggle(v as TypeTasks_RI)}
                    />

                    <div className="editor-block-adapt__descr">
                        <span>
                            {
                                obj.points.find((item) => item.value === value)
                                    ?.description
                            }
                        </span>
                    </div>
                </div>
            ))}

            <div className="editor-block-filters__new-and-gen-btns">
                {isIntensity && (
                    <Button
                        icon={
                            genInten.isGen
                                ? Loader
                                : 0 < Object.keys(genInten.fixed).length
                                  ? IcoBack
                                  : IcoMagic
                        }
                        onClick={hundleGenerate}
                    />
                )}
            </div>
        </div>
    );
}

export default BlockAdapt;
