import './style.scss'
import { atomUser, useAtom, addToast } from '@utils/jotai.store'

function User () {
    const [user, ] = useAtom(atomUser)
    // const [user, updateUser] = useAtom(atomUser)

    return <div className="user-profile">
        <picture className="user-profile__avatar">
            <img src={user.avatar_src} alt={user.name} />
        </picture>
        <div className="user-profile__name">
            {user.name}
        </div>
        <div className="user-profile__role">
            {user.role}
        </div>
        <div 
            className="user-profile__email" 
            onClick={() => {
                navigator.clipboard.writeText(user.email)
                addToast("E-mail скопирован!")
            }}
            >{user.email}
        </div>
    </div>
}

export default User