
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
    hour = hour % 12 || 12
    return `${hour}:${minutes} ${ampm}`
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
    return `${hoursNumber.toString().padStart(2, '0')}:${minutes}`
}

// const checkIsOccupied = (roomAll: string[], bookingAll: string[], nextIdAvailable: number) => {

//     const room = roomAll.find(room => room.id === nextIdAvailable)
//     if (!room) { return }

//     const bookings = bookingAll.filter(booking => room.booking_list.includes(booking.id))
//     if (!bookings) { return }

//     const bookingDataCheckIn = new Date(`${dateFormatToYYYYMMDD(newBooking.check_in_date)}T${hourFormatTo24H(newBooking.check_in_time)}:00`)
//     const bookingDataCheckOut = new Date(`${dateFormatToYYYYMMDD(newBooking.check_out_date)}T${hourFormatTo24H(newBooking.check_out_time)}:00`)
//     for (let booking of bookings) {
//         const bookingCheckIn = new Date(`${dateFormatToYYYYMMDD(booking.check_in_date)}T${hourFormatTo24H(booking.check_in_time)}:00`)
//         const bookingCheckOut = new Date(`${dateFormatToYYYYMMDD(booking.check_out_date)}T${hourFormatTo24H(booking.check_out_time)}:00`)

//         if ((bookingDataCheckIn < bookingCheckOut) && (bookingDataCheckOut > bookingCheckIn)) {
//             return true
//         }
//     }
//     return false
// }