
export type TypeUser = {
    email: string
    role: "admin" | "premium" | "user" | "banned" | "not_activated"
    name: string
    tokens: number
    avatar_src: string
}