import "./style.scss";
import { useState } from "react";
import {
    useAtomValue,
    useSetAtom,
    atomUser,
    addToast,
    atomIsOpenSidePanel,
    atomIsOpenEditorUser,
} from "@utils/jotai.store";
import ThemeToggle from "@comps/Toggles/ThemeToggle";
import Button from "@comps/Button/Button";

import IcoSetting from "@asset/setting.svg";

function User() {
    const user = useAtomValue(atomUser);
    const setOpenSidePanel = useSetAtom(atomIsOpenSidePanel);
    const toggleIsOpenEditorUser = useSetAtom(atomIsOpenEditorUser);

    return (
        <div className="user-profile">
            <picture className="user-profile__avatar">
                <img src={user.avatar_url} alt={user.full_name} />
            </picture>
            <div className="user-profile__name">{user.full_name}</div>
            <div className="user-profile__role">{user.role}</div>
            <div
                className="user-profile__email"
                onClick={() => {
                    navigator.clipboard.writeText(user.email);
                    addToast("E-mail скопирован!");
                }}
            >
                {user.email}
            </div>
            <div className="user-profile__balance">{`balance: ${user.balance}`}</div>

            <ThemeToggle />

            <div className="user-profile__notifs">
                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>

                <div className="user-notif-item">
                    <div className="user-notif-item__title">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Dolor sint eos voluptatibus perferendis tempore
                        optio et officiis numquam error velit, dolorem
                        repellendus aspernatur fugit reiciendis doloremque
                        dolore soluta sunt cum?
                    </div>
                    <div className="user-notif-item__message">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nostrum dolorum blanditiis saepe voluptatum.
                        Consequatur minus recusandae iusto dolore voluptatem sed
                        sunt expedita quisquam possimus! Earum aliquam error
                        esse aperiam assumenda?
                    </div>
                </div>
            </div>

            <Button
                icon={IcoSetting}
                text="setting"
                variant="second"
                onClick={(e) => {
                    setOpenSidePanel("none");
                    toggleIsOpenEditorUser((prev) => !prev);
                    e.stopPropagation();
                }}
            />
        </div>
    );
}

export default User;
