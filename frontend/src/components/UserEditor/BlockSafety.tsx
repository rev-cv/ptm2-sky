import { TypeUser } from "@mytype/typesUser";

type TypeProps = {
    user: TypeUser;
    updateUser: (user: TypeUser) => void;
};

type returnType = React.JSX.Element | null;

function BlockSafety({user, updateUser}:TypeProps): returnType {
    return <div className="editor-user__block">BlockSafety {user.email}</div>;
}

export default BlockSafety;
