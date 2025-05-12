
export function formatDateString(isoDate: string): string {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const dayOfYear = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}, ${dayOfYear} ${month} ${hours}:${minutes}`;
}