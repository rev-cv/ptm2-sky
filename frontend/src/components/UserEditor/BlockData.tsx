import { TypeUser } from "@mytype/typesUser";

type TypeProps = {
    user: TypeUser;
    updateUser: (user: TypeUser) => void;
};

type returnType = React.JSX.Element | null;

function BlockData({user, updateUser}:TypeProps): returnType {
    return <div className="editor-user__block">BlockData {user.email}</div>;
}

export default BlockData;
