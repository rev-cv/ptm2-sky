import { atom } from 'jotai'
import { TypeFilterAssocServer } from '@mytype/typeSearchAndFilter'

export const atomFilterList = atom<TypeFilterAssocServer|null>(null)

export const stateNames = {
    "physical": "физическое",
    "intellectual": "интеллектуальное",
    "emotional": "эмоциональное",
    "motivational": "мотивационное",
    "social": "социальное",
}