"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidator = void 0;
var commonValidator_1 = require("./commonValidator");
var bookingStatus_1 = require("../enums/bookingStatus");
var roomType_1 = require("../enums/roomType");
var roomValidator_1 = require("./roomValidator");
var BookingValidator = /** @class */ (function () {
    function BookingValidator() {
    }
    BookingValidator.prototype.validateProperties = function (booking, checkRoomList) {
        var errorMessages = [];
        var bookingRequiredProperties;
        checkRoomList ?
            bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
                'check_in_date', 'check_out_date', 'status', 'special_request', 'room_list']
            :
                bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
                    'check_in_date', 'check_out_date', 'status', 'special_request'];
        bookingRequiredProperties.map(function (property) {
            if (!(property in booking)) {
                errorMessages.push("Property [".concat(property, "] is required in Booking"));
            }
        });
        return errorMessages;
    };
    BookingValidator.prototype.validateBooking = function (booking, allBookings, allRooms) {
        var allErrorMessages = [];
        var checkRoomList;
        allRooms === undefined ? checkRoomList = false : checkRoomList = true;
        var errorsCheckingProperties = this.validateProperties(booking, checkRoomList);
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties;
        }
        // validatePhoto(booking.photo, 'Photo').map(error => allErrorMessages.push(error))
        (0, commonValidator_1.validateFullName)(booking.full_name_guest, 'Full name guest').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateDateRelativeToNow)(new Date(booking.order_date), true, 'Order date').map(function (error) { return allErrorMessages.push(error); });
        this.validateCheckInCheckOut(new Date(booking.check_in_date), new Date(booking.check_out_date)).map(function (error) { return allErrorMessages.push(error); });
        // this.validateDateIsOccupied(new Date(booking.check_in_date), new Date(booking.check_out_date), allBookings).map(error => allErrorMessages.push(error))
        this.validateDateIsOccupied(booking, allBookings).map(function (error) { return allErrorMessages.push(error); });
        this.validateBookingStatus(booking.status).map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateTextArea)(booking.special_request, 'Special request').map(function (error) { return allErrorMessages.push(error); });
        if (allRooms !== undefined) {
            this.validateRoomList(booking.room_list, allRooms).map(function (error) { return allErrorMessages.push(error); });
        }
        return allErrorMessages;
    };
    BookingValidator.prototype.validateRoomId = function (roomId) {
        var errorMessages = [];
        if (typeof roomId !== "string") {
            errorMessages.push('Room id is not a string');
        }
        return errorMessages;
    };
    BookingValidator.prototype.validateRoomType = function (type) {
        var errorMessages = [];
        if (typeof type !== "string") {
            errorMessages.push('Room Type is not a String');
        }
        if (!Object.values(roomType_1.RoomType).includes(type)) {
            errorMessages.push('Room type is not a valid value');
        }
        return errorMessages;
    };
    BookingValidator.prototype.validateBookingStatus = function (type) {
        var errorMessages = [];
        if (typeof type !== "string") {
            errorMessages.push('Booking status is not a String');
        }
        if (!Object.values(bookingStatus_1.BookingStatus).includes(type)) {
            errorMessages.push('Booking status is not a valid value');
        }
        return errorMessages;
    };
    BookingValidator.prototype.validateCheckInCheckOut = function (checkIn, checkOut) {
        var errorMessages = [];
        (0, commonValidator_1.validateDateRelativeToNow)(checkIn, false, 'Check in date').map(function (error) { return errorMessages.push(error); });
        (0, commonValidator_1.validateDateRelativeToNow)(checkOut, false, 'Check out date').map(function (error) { return errorMessages.push(error); });
        if (checkIn >= checkOut) {
            errorMessages.push('Check in date must be before Check out date');
        }
        return errorMessages;
    };
    BookingValidator.prototype.validateDateIsOccupied = function (booking, bookings) {
        var errorMessages = [];
        for (var i = 0; i < bookings.length; i++) {
            console.log(booking._id);
            console.log(bookings[i]._id);
            if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
                new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
                errorMessages.push("This period is already occupied by booking #".concat(bookings[i]._id));
            }
        }
        return errorMessages;
    };
    BookingValidator.prototype.validateRoomList = function (roomList, allRooms) {
        var errorMessages = [];
        var roomValidator = new roomValidator_1.RoomValidator();
        roomList.map(function (room) {
            if (room === undefined || Object.keys(room).length === 0) {
                errorMessages.push('Some booking in booking_list of rooms is undefined or empty');
                return;
            }
            roomValidator.validateProperties(room, false);
            roomValidator.validateRoom(room, allRooms);
        });
        return errorMessages;
    };
    return BookingValidator;
}());
exports.BookingValidator = BookingValidator;
