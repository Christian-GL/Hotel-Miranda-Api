
import { RoomInterface } from "../interfaces/roomInterface"
import { BookingInterface } from "../interfaces/bookingInterface"


export const roomBookingListAreEqual = (arr1: RoomInterface[], arr2: RoomInterface[]): boolean => {

    if (arr1.length !== arr2.length) return false

    const set1 = new Set(arr1.map(obj => obj._id))
    const set2 = new Set(arr2.map(obj => obj._id))

    return set1.size === set2.size && [...set1].every(id => set2.has(id))
}

// export const bookingRoomListAreEqual = (bookingsOld: BookingInterface[], bookingsNew: BookingInterface[]): boolean => {

//     if (bookingsOld.room_list.length !== bookingsNew.length) return false

//     const set1 = new Set(bookingsOld.map(obj => obj.room_list.number))
//     const set2 = new Set(bookingsNew.map(obj => obj.room_list.number))

//     return set1.size === set2.size && [...set1].every(id => set2.has(id))
// }