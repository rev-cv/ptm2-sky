export type TypeUser = {
    id: number;
    email: string;
    role: "admin" | "premium" | "user" | "banned" | "not_activated";
    full_name: string;
    balance: number;
    avatar_url: string;
    registered: string;

    isFull: boolean | null;
    // ↑ поле isFull не является частью API
    // его задача сигнализировать о состоянии загрузки
    // - null - информации о пользователе нет
    // - false - загружена минимальная информация о пользователе
    // - true - вся информация о пользователе присутствует
};

export const PagesForUserEditor = {
    ACCOUNT: 0,
    SAFETY: 1,
    NOTIFICATION: 2,
    APPEARANCE: 3,
    INTEGRATION: 4,
    DATA: 5,
};
