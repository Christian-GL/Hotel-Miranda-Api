
export const checkFirstIDAvailable = (list: number[]) => {

    const sortedList = [...list].sort((a, b) => a - b)
    if (sortedList[0] > 1) {
        return 1
    }
    for (let i = 0; i < sortedList.length - 1; i++) {
        const currentId = sortedList[i]
        const nextId = sortedList[i + 1]
        if (nextId - currentId > 1) {
            return currentId + 1
        }
    }

    return sortedList[sortedList.length - 1] + 1
}

export const dateFormatToYYYYMMDD = (dateDDMMYYYY: string) => {
    const [day, month, year] = dateDDMMYYYY.split('/')
    return `${year}-${month}-${day}`
}

export const dateFormatToDDMMYYYY = (dateYYYYMMDD: string) => {
    const [year, month, day] = dateYYYYMMDD.split('-')
    return `${day}/${month}/${year}`
}

export const hourFormatTo12H = (time24H: string) => {
    const [hours, minutes] = time24H.split(":")
    let hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour === 0 && ampm === 'AM' ? 0 : hour
    const minute = minutes
    return `${hour}:${minute} ${ampm}`
}

export const hourFormatTo24H = (time12H: string) => {
    const [hour12HFormat, period] = time12H.split(' ')
    let [hours, minutes] = hour12HFormat.split(':')
    let hoursNumber = parseInt(hours)
    if (period === 'PM' && hoursNumber < 12) {
        hoursNumber += 12
    }
    if (period === 'AM' && hoursNumber === 12) {
        hoursNumber = 0
    }
    return `${hoursNumber < 10 ? '0' + hours : hours}:${minutes}`
}