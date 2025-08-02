import './style.scss'
import { atomUser, useAtomValue } from '@utils/jotai.store'
import IcoMagic from '@asset/magic.svg'

function TokenMagicCounter () {

    const user = useAtomValue(atomUser)

    return <div className='user-token-info'>
        <IcoMagic />
        {user.tokens}
    </div>
}

export default TokenMagicCounter