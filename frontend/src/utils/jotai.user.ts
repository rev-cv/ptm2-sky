import { TypeUser } from "@mytype/typesUser";
import { PagesForUserEditor as Page } from "@mytype/typesUser";
import { atom } from "jotai";

export const atomUser = atom<TypeUser>({
    id: 0,
    full_name: "Roman",
    email: "test@mail.com",
    role: "user",
    balance: 0,
    avatar_url: "/avatar0.webp",
    registered: "2025-08-24T00:00:00Z",
    isFull: false,

    // FULL

});

export const atomIsOpenEditorUser = atom<boolean>(false);
export const atomOpenedPageInEditorUser =
    atom<(typeof Page)[keyof typeof Page]>(0);

export const avatarPresets = [
    { name: "Avatar 1", url: "/avatar0.webp", type: "zero" },
    { name: "Avatar 2", url: "/avatar1.webp", type: "male" },
    { name: "Avatar 3", url: "/avatar2.webp", type: "male" },
    { name: "Avatar 4", url: "/avatar3.webp", type: "male" }, 
    { name: "Avatar 5", url: "/avatar4.webp", type: "male" },
    { name: "Avatar 6", url: "/avatar5.webp", type: "male" },
    { name: "Avatar 7", url: "/avatar6.webp", type: "fema" },
    { name: "Avatar 8", url: "/avatar7.webp", type: "fema" },
    { name: "Avatar 9", url: "/avatar8.webp", type: "fema" },
]

export const avatarPresets__types = avatarPresets
  .map(item => item.type)
  .filter((value, index, self) => self.indexOf(value) === index);

export const avatarPresets__groupedByType = avatarPresets__types
    .map(type =>avatarPresets.filter(item => item.type === type));