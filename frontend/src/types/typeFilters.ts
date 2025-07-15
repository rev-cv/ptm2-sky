
export type TypeFilterNew = {
    id: number
    name: string
    desc: string
    type: string
}

export type TypeSchemeStates = {
    physical: TypeFilterNew[]
    intellectual: TypeFilterNew[]
    emotional: TypeFilterNew[]
    motivational: TypeFilterNew[]
    social: TypeFilterNew[]
}