import { TypeUser } from "@mytype/typesUser";
import { useState } from "react";
import TextArea from "@comps/TextArea/TextArea";
import { formatDateString } from "@utils/date-funcs";
import { avatarPresets__groupedByType } from "@utils/jotai.store";

type TypeProps = {
    // props здесь если надо
    user: TypeUser;
    updateUser: (user: TypeUser) => void;
};

type returnType = React.JSX.Element | null;

function BlockAccount({ user, updateUser }: TypeProps): returnType {
    const [isViewAvatars, setIsViewAvatars] = useState(false);

    return (
        <div className="editor-user__block editor-block-account">

            <div className="editor-block-account__reg">{`registered: ${formatDateString(user.registered)}`}</div>


            <div className="editor-block-account__avatar-user">
                <img
                    src={user.avatar_url}
                    alt="user avatar"
                    className="editor-block-account__avatar-user-img"
                    onClick={() => setIsViewAvatars(!isViewAvatars)}
                />
            </div>


            <div
                className={`editor-block-account__avatar ${isViewAvatars ? "active" : ""}`}
            >
                <div>
                    {avatarPresets__groupedByType.map((group, idx) => (
                        <div
                            key={`avatar-preset-group-${idx}`}
                            className="editor-block-account__line"
                        >
                            {group.map((preset) => {
                                return (
                                    <img
                                        key={`avatar-preset-${preset.url}`}
                                        src={preset.url}
                                        alt="avatar preset"
                                        className={`editor-block-account__avatar-item ${user.avatar_url === preset.url ? "editor-block-account__avatar-item--active" : ""}`}
                                        onClick={() => {
                                            updateUser({
                                                ...user,
                                                avatar_url: preset.url,
                                            });
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <TextArea
                label="Username"
                className="editor-block-account__username"
                isBanOnEnter={true}
                value={user.full_name}
                onChange={(e) => {
                    updateUser({
                        ...user,
                        full_name: e.target.value,
                    });
                }}
            />

            <TextArea
                label="Email"
                className="editor-block-account__email"
                isBanOnEnter={true}
                isBlockInput={true}
                value={user.email}
                onChange={(e) => {
                    updateUser({
                        ...user,
                        email: e.target.value,
                    });
                }}
            />

            

            
        </div>
    );
}

export default BlockAccount;
