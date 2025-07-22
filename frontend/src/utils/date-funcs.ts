
export function formatDateString(isoDate: string | Date): string {
    const date = new Date(isoDate)

    const year = date.getFullYear()
    const dayOfYear = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'long' })
    // const hours = date.getHours().toString().padStart(2, '0')
    // const minutes = date.getMinutes().toString().padStart(2, '0')

    // return `${year}, ${dayOfYear} ${month} ${hours}:${minutes}`
    return `${year}, ${dayOfYear} ${month}`
}

export function getDaysDifference(date_str: string): number {
    if (!date_str) return 0;

    const today = new Date();
    const selectedDate = new Date(date_str)

    if (isNaN(selectedDate.getTime())) {
        return 0;
    }

    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    const diffInMs = selectedDate.getTime() - today.getTime()

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    return 0 < diffInDays ? diffInDays + 1 : diffInDays
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

type mydate = Date | string | null

export function formatPeriod(start?: mydate, finish?: mydate): string {
    
    const currentYear = new Date().getFullYear()

    function parseDate(d: Date | string | null | undefined): Date | null {
        if (!d) return null;
        if (d instanceof Date) return d;
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    const s = parseDate(start);
    const f = parseDate(finish);

    if (!s && !f) return "";

    // Формат для одной даты
    function formatSingle(d: Date, prefix: string) {
        const year = d.getFullYear() === currentYear ? "" : `${d.getFullYear()}, `;
        const month = d.toLocaleString('en-US', { month: 'short' });
        return `${prefix} ${year}${d.getDate()} ${month}`;
    }

    // Формат для двух дат
    function formatRange(s: Date, f: Date) {
        const sYear = s.getFullYear()
        const fYear = f.getFullYear()
        const sMonth = s.toLocaleString('en-US', { month: 'short' })
        const fMonth = f.toLocaleString('en-US', { month: 'short' })

        const showSYear = sYear !== currentYear
        const showFYear = fYear !== currentYear

        if (sYear === fYear && sMonth === fMonth) {
            // один месяц и год
            const year = showSYear ? `${sYear}, ` : ""
            return `${year}${s.getDate()} - ${f.getDate()} ${sMonth}`
        } else if (sYear === fYear) {
            // один год, разные месяцы
            const year = showSYear ? `${sYear}, ` : ""
            return `${year}${s.getDate()} ${sMonth} - ${f.getDate()} ${fMonth}`
        } else {
            // разные года
            const sYearStr = showSYear ? `${sYear}, ` : ""
            const fYearStr = showFYear ? `${fYear}, ` : ""
            return `${sYearStr}${s.getDate()} ${sMonth} - ${fYearStr}${f.getDate()} ${fMonth}`
        }
    }

    if (s && !f) return formatSingle(s, "after")
    if (!s && f) return formatSingle(f, "before")
    if (s && f) return formatRange(s, f)

    return "";
}

export const newTaskCheck = () => {
    const tomorrow = new Date(Date.now() + 86400000)
    tomorrow.setUTCHours(0, 0, 0, 0)
    return tomorrow.toISOString()
}

export function sortDateStrings(dateStrings: string[]): string[] {
    if (!Array.isArray(dateStrings) || dateStrings.length === 0) {
        return [];
    }
    return [...new Set(dateStrings)]
        .map(str => ({
            original: str,
            date: new Date(str)
        }))
        .filter(item => !isNaN(item.date.getTime()))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(item => item.original);
}