"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidator = void 0;
var commonValidator_1 = require("./commonValidator");
var bookingStatus_1 = require("../enums/bookingStatus");
var roomType_1 = require("../enums/roomType");
var BookingValidator = /** @class */ (function () {
    function BookingValidator() {
    }
    BookingValidator.prototype.validateProperties = function (booking) {
        var errorMessages = [];
        var bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'room', 'booking_status', 'special_request'];
        var roomRequiredProperties = ['id', 'type'];
        bookingRequiredProperties.map(function (property) {
            if (!(property in booking)) {
                errorMessages.push("Property [".concat(property, "] is required in Booking"));
            }
        });
        if (booking.room) {
            roomRequiredProperties.map(function (property) {
                if (!(property in booking.room)) {
                    errorMessages.push("Property [".concat(property, "] is required in Booking.room"));
                }
            });
        }
        else
            errorMessages.push('Property [Booking.room] is required in Booking');
        return errorMessages;
    };
    BookingValidator.prototype.validateBooking = function (booking, allBookings) {
        var allErrorMessages = [];
        var errorsCheckingProperties = this.validateProperties(booking);
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties;
        }
        // validatePhoto(booking.photo, 'Photo').map(
        //     error => allErrorMessages.push(error)
        // )
        (0, commonValidator_1.validateFullName)(booking.full_name_guest, 'Full name guest').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateDateRelativeToNow)(booking.order_date, true, 'Order date').map(function (error) { return allErrorMessages.push(error); });
        this.validateCheckInCheckOut(booking.check_in_date, booking.check_out_date).map(function (error) { return allErrorMessages.push(error); });
        this.validateDateIsOccupied(booking.check_in_date, booking.check_out_date, allBookings).map(function (error) { return allErrorMessages.push(error); });
        if (booking.room.id) {
            this.validateRoomId(booking.room.id).map(function (error) { return allErrorMessages.push(error); });
        }
        else
            allErrorMessages.push('Booking.room.id not found');
        if (booking.room.type) {
            this.validateRoomType(booking.room.type).map(function (error) { return allErrorMessages.push(error); });
        }
        else
            allErrorMessages.push('Booking.room.type not found');
        this.validateBookingStatus(booking.booking_status).map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateTextArea)(booking.special_request, 'Special request').map(function (error) { return allErrorMessages.push(error); });
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
    BookingValidator.prototype.validateDateIsOccupied = function (checkIn, checkOut, bookings) {
        var errorMessages = [];
        for (var i = 0; i < bookings.length; i++) {
            if (checkIn < bookings[i].check_out_date && checkOut > bookings[i].check_in_date) {
                errorMessages.push("This period is already occupied by booking #".concat(bookings[i]._id));
            }
        }
        return errorMessages;
    };
    return BookingValidator;
}());
exports.BookingValidator = BookingValidator;
