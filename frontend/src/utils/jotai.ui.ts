import { atom } from "jotai";

// открытая боковая панель
export const atomIsOpenSidePanel = atom<"none" | "right" | "left" | "setting">(
    "none",
);

// атом для хранения текущей темы
export const atomTheme = atom<"light" | "dark" | "auto">(
    (typeof window !== "undefined" &&
        (localStorage.getItem("theme") as "light" | "dark" | "auto")) ||
        "auto",
);

// сохранение темы в localStorage
export const themeWithStorageAtom = atom(
    (get) => get(atomTheme),
    (_, set, newTheme: "light" | "dark" | "auto") => {
        set(atomTheme, newTheme);
        localStorage.setItem("theme", newTheme);
    },
);
