
export function formatDateString(isoDate: string | Date): string {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const dayOfYear = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    // const hours = date.getHours().toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');

    // return `${year}, ${dayOfYear} ${month} ${hours}:${minutes}`;
    return `${year}, ${dayOfYear} ${month}`;
}

export function getDaysDifference(date_str: string): number {
    if (!date_str) return 0;

    const today = new Date();
    const selectedDate = new Date(date_str);

    if (isNaN(selectedDate.getTime())) {
        return 0;
    }

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const diffInMs = selectedDate.getTime() - today.getTime();

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return 0 < diffInDays ? diffInDays + 1 : diffInDays;
}


export function sortDates (old_dates: string[]) {
    // разделение на даты и пустые строки
    const dates = old_dates.filter(str => str && str.trim() !== "")
    const emptyCount = old_dates.length - dates.length

    dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    if (0 < emptyCount) {
        dates.push("")
    }

    return dates
}