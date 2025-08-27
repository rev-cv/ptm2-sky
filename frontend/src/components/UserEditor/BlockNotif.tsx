import { TypeUser } from "@mytype/typesUser";

type TypeProps = {
    user: TypeUser;
    updateUser: (user: TypeUser) => void;
};

type returnType = React.JSX.Element | null;

function BlockNotif({user, updateUser}:TypeProps): returnType {
    return <div className="editor-user__block">BlockNotif {user.email}</div>;
}

export default BlockNotif;
