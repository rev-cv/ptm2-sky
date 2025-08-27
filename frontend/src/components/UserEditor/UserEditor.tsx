import "./style.scss";
import { PagesForUserEditor as Page } from "@mytype/typesUser";
import {
    useAtom,
    useSetAtom,
    atomUser,
    atomIsOpenEditorUser,
    atomOpenedPageInEditorUser,
} from "@utils/jotai.store";

import Modal from "@comps/Modal/Modal";
import BlockMenu from "./BlockMenu";
import BlockAccount from "./BlockAccount";
import BlockSafety from "./BlockSafety";
import BlockNotification from "./BlockNotif";
import BlockAppearance from "./BlockAppearance";
import BlockIntegration from "./BlockIntegration";
import BlockData from "./BlockData";

function UserEditor() {
    const [user, updateUser] = useAtom(atomUser);
    const toogleIsOpenEditorUser = useSetAtom(atomIsOpenEditorUser);
    const [openedPage, setOpenedPage] = useAtom(atomOpenedPageInEditorUser);

    const PageViewed = (() => {
        switch (openedPage) {
            case Page.ACCOUNT:
                return <BlockAccount user={user} updateUser={updateUser} />;
            case Page.SAFETY:
                return <BlockSafety user={user} updateUser={updateUser} />;
            case Page.NOTIFICATION:
                return (
                    <BlockNotification user={user} updateUser={updateUser} />
                );
            case Page.APPEARANCE:
                return <BlockAppearance user={user} updateUser={updateUser} />;
            case Page.INTEGRATION:
                return <BlockIntegration user={user} updateUser={updateUser} />;
            case Page.DATA:
                return <BlockData user={user} updateUser={updateUser} />;
            default:
                return <BlockAccount user={user} updateUser={updateUser} />;
        }
    })();

    // if (!user.isFull) return;

    return (
        <Modal
            visible={true}
            onRequestClose={() => {
                setTimeout(() => {
                    toogleIsOpenEditorUser(false);
                }, 300);
            }}
        >
            <div className="editor-user">
                <BlockMenu
                    activeTab={openedPage}
                    onChangeTab={(p) => {
                        setOpenedPage(p);
                    }}
                />
                <div className="editor-user__content">
                    {PageViewed && PageViewed}
                </div>
            </div>
        </Modal>
    );
}

export default UserEditor;
