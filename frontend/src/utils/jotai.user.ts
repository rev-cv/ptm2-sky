import { TypeUser } from '@mytype/typesUser'
import { atom } from 'jotai'

export const atomUser = atom<TypeUser>({
    name: "Roman",
    email: "test@mail.com",
    role: "user",
    tokens: 0,
    avatar_src: '/avatar.webp'
})

