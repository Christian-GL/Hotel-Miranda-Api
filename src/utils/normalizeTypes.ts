
const normalizeString = (test: any) => String(test ?? '').trim()

const normalizeStringArray = (test: any): string[] =>
    test == null
        ? []
        : Array.isArray(test)
            ? test.map(x => String(x ?? '').trim()).filter(s => s.length > 0)
            : [String(test).trim()].filter(s => s.length > 0)

const parseDateSafe = (test: any): Date | undefined => {
    if (test === null || test === undefined || test === '') return undefined
    const date = new Date(test)
    return isNaN(date.getTime())
        ? undefined
        : date
}

const parseNumberSafe = (test: any): number | undefined => {
    if (test === null || test === undefined || test === '') return undefined
    const number = Number(String(test).trim())
    return Number.isFinite(number)
        ? number
        : undefined
}