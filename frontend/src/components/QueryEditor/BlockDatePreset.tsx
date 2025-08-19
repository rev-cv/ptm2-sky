import Button from "@comps/Button/Button";

type TypeProp = {
    presets: [string, () => void][];
};

function BlockDatePreset({ presets }: TypeProp) {
    return (
        <div className="query-block-editor__presets">
            {presets.map((p) => (
                <Button text={p[0]} variant="second" onClick={p[1]} />
            ))}
        </div>
    );
}

export default BlockDatePreset;
