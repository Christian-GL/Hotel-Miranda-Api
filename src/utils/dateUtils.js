"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hourFormatTo24H = exports.hourFormatTo12H = exports.dateFormatToDDMMYYYY = exports.dateFormatToYYYYMMDD = exports.checkFirstIDAvailable = void 0;
var checkFirstIDAvailable = function (list) {
    var sortedList = __spreadArray([], list, true).sort(function (a, b) { return a - b; });
    if (sortedList[0] > 1) {
        return 1;
    }
    for (var i = 0; i < sortedList.length - 1; i++) {
        var currentId = sortedList[i];
        var nextId = sortedList[i + 1];
        if (nextId - currentId > 1) {
            return currentId + 1;
        }
    }
    return sortedList[sortedList.length - 1] + 1;
};
exports.checkFirstIDAvailable = checkFirstIDAvailable;
var dateFormatToYYYYMMDD = function (dateDDMMYYYY) {
    var _a = dateDDMMYYYY.split('/'), day = _a[0], month = _a[1], year = _a[2];
    return "".concat(year, "-").concat(month, "-").concat(day);
};
exports.dateFormatToYYYYMMDD = dateFormatToYYYYMMDD;
var dateFormatToDDMMYYYY = function (dateYYYYMMDD) {
    var _a = dateYYYYMMDD.split('-'), year = _a[0], month = _a[1], day = _a[2];
    return "".concat(day, "/").concat(month, "/").concat(year);
};
exports.dateFormatToDDMMYYYY = dateFormatToDDMMYYYY;
var hourFormatTo12H = function (time24H) {
    var _a = time24H.split(":"), hours = _a[0], minutes = _a[1];
    var hour = parseInt(hours);
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return "".concat(hour, ":").concat(minutes, " ").concat(ampm);
};
exports.hourFormatTo12H = hourFormatTo12H;
var hourFormatTo24H = function (time12H) {
    var _a = time12H.split(' '), hour12HFormat = _a[0], period = _a[1];
    var _b = hour12HFormat.split(':'), hours = _b[0], minutes = _b[1];
    var hoursNumber = parseInt(hours);
    if (period === 'PM' && hoursNumber < 12) {
        hoursNumber += 12;
    }
    if (period === 'AM' && hoursNumber === 12) {
        hoursNumber = 0;
    }
    return "".concat(hoursNumber.toString().padStart(2, '0'), ":").concat(minutes);
};
exports.hourFormatTo24H = hourFormatTo24H;
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
