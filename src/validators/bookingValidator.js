"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidator = void 0;
var commonValidator_1 = require("./commonValidator");
var bookingStatus_1 = require("../enums/bookingStatus");
var roomType_1 = require("../enums/roomType");
var BookingValidator = /** @class */ (function () {
    function BookingValidator() {
    }
    BookingValidator.prototype.validateNewBookingProperties = function (booking) {
        var errorMessages = [];
        var bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'status', 'special_request', 'room_id'];
        bookingRequiredProperties.map(function (property) {
            if (!(property in booking)) {
                errorMessages.push("Property [".concat(property, "] is required in Booking"));
            }
        });
        return errorMessages;
    };
    BookingValidator.prototype.validateExistingBookingProperties = function (booking) {
        var errorMessages = [];
        var bookingRequiredProperties = ['_id', 'photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'status', 'special_request', 'room_id'];
        bookingRequiredProperties.map(function (property) {
            if (!(property in booking)) {
                errorMessages.push("Property [".concat(property, "] is required in Booking"));
            }
        });
        return errorMessages;
    };
    BookingValidator.prototype.validateBooking = function (booking, allBookings, allRooms) {
        var errorMessages = [];
        if (booking === undefined || Object.keys(booking).length === 0) {
            errorMessages.push('Room is undefined or empty');
            return errorMessages;
        }
        (0, commonValidator_1.validateIDObjectId)(booking._id, '_ID').map(function (error) { return errorMessages.push(error); });
        // validatePhoto(booking.photo, 'Photo').map(error => allErrorMessages.push(error))
        (0, commonValidator_1.validateFullName)(booking.full_name_guest, 'Full name guest').map(function (error) { return errorMessages.push(error); });
        (0, commonValidator_1.validateDateRelativeToNow)(new Date(booking.order_date), true, 'Order date').map(function (error) { return errorMessages.push(error); });
        this.validateCheckInCheckOut(new Date(booking.check_in_date), new Date(booking.check_out_date)).map(function (error) { return errorMessages.push(error); });
        // this.validateDateIsOccupied(new Date(booking.check_in_date), new Date(booking.check_out_date), allBookings).map(error => allErrorMessages.push(error))
        this.validateDateIsOccupied(booking, allBookings).map(function (error) { return errorMessages.push(error); });
        this.validateBookingStatus(booking.status).map(function (error) { return errorMessages.push(error); });
        (0, commonValidator_1.validateTextArea)(booking.special_request, 'Special request').map(function (error) { return errorMessages.push(error); });
        this.validateRoomList(booking.room_id, allRooms).map(function (error) { return errorMessages.push(error); });
        return errorMessages;
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
            if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
                new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
                errorMessages.push("This period is already occupied by booking #".concat(bookings[i]._id));
            }
        }
        return errorMessages;
    };
    BookingValidator.prototype.validateRoomList = function (roomId, allRooms) {
        var errorMessages = [];
        (0, commonValidator_1.validateIDstring)(roomId, 'ID').map(function (error) {
            errorMessages.push(error);
        });
        var roomExists = allRooms.some(function (room) { return room._id.toString() === roomId; });
        if (!roomExists) {
            errorMessages.push("Room with ID #".concat(roomId, " does not exist"));
        }
        return errorMessages;
    };
    return BookingValidator;
}());
exports.BookingValidator = BookingValidator;
