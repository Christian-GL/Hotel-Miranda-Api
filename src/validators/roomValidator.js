"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomValidator = void 0;
var roomType_1 = require("../enums/roomType");
var roomAmenities_1 = require("../enums/roomAmenities");
var bookingValidator_1 = require("./bookingValidator");
var RoomValidator = /** @class */ (function () {
    function RoomValidator() {
    }
    RoomValidator.prototype.validateProperties = function (room, checkBookingList) {
        var errorMessages = [];
        var requiredProperties;
        checkBookingList ?
            requiredProperties = ['photos', 'number', 'type', 'amenities', 'price', 'discount', 'booking_list'] :
            requiredProperties = ['photos', 'number', 'type', 'amenities', 'price', 'discount'];
        requiredProperties.map(function (property) {
            if (!(property in room)) {
                errorMessages.push("Property [".concat(property, "] is required in Room"));
            }
        });
        return errorMessages;
    };
    RoomValidator.prototype.validateRoom = function (room, allRooms, allBookings) {
        var errorMessages = [];
        if (room === undefined || Object.keys(room).length === 0) {
            errorMessages.push('Some room is undefined or empty');
            return errorMessages;
        }
        var checkBookingList;
        allBookings === undefined ? checkBookingList = false : checkBookingList = true;
        var errorsCheckingProperties = this.validateProperties(room, checkBookingList);
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties;
        }
        // this.validatePhotos(room.photos).errorMessages.map(error => allErrorMessages.push(error))
        this.validateNumber(room.number, false, allRooms).map(function (error) { return errorMessages.push(error); });
        this.validateRoomType(room.type).map(function (error) { return errorMessages.push(error); });
        this.validateAmenities(room.amenities).map(function (error) { return errorMessages.push(error); });
        this.validateRoomPrice(room.price).map(function (error) { return errorMessages.push(error); });
        this.validateRoomDiscount(room.discount).map(function (error) { return errorMessages.push(error); });
        if (allBookings !== undefined) {
            this.validateBookingList(room.booking_list, allBookings, allRooms).map(function (error) { return errorMessages.push(error); });
        }
        return errorMessages;
    };
    RoomValidator.prototype.validatePhotos = function (photos) {
        var errorMessages = [];
        var regex = /\.(png|jpg)$/i;
        photos.forEach(function (photo, index) {
            if (typeof photo !== "string") {
                errorMessages.push("Photo ".concat(index, " url is not a String"));
            }
            if (!regex.test(photo)) {
                errorMessages.push("Photo ".concat(index, " is not .png or .jpg file"));
            }
        });
        if (photos[0] === undefined) {
            errorMessages.push('Main photo need to be set');
        }
        if (photos.length < 3) {
            errorMessages.push('Photos need to be at least 3');
        }
        return errorMessages;
    };
    RoomValidator.prototype.validateNumber = function (number, validateExistingRoom, allRooms) {
        var errorMessages = [];
        var regex = new RegExp(/^\d{3}$/);
        if (typeof number !== "string") {
            errorMessages.push('Number is not a string');
        }
        if (!regex.test(number)) {
            errorMessages.push('Number must have 3 numeric digits between 000 and 999');
        }
        if (!validateExistingRoom) {
            allRooms.map(function (room) {
                if (room.number === number) {
                    errorMessages.push('Number is already taken');
                }
            });
        }
        return errorMessages;
    };
    RoomValidator.prototype.validateRoomType = function (type) {
        var errorMessages = [];
        if (typeof type !== "string") {
            errorMessages.push('Room Type is not a String');
        }
        if (!Object.values(roomType_1.RoomType).includes(type)) {
            errorMessages.push('Room type is not a valid value');
        }
        return errorMessages;
    };
    RoomValidator.prototype.validateAmenities = function (amenities) {
        var errorMessages = [];
        if (!Array.isArray(amenities)) {
            errorMessages.push('Amenities is not an array of strings');
        }
        amenities.map(function (amenity) {
            if (!Object.values(roomAmenities_1.RoomAmenities).includes(amenity)) {
                errorMessages.push("Amenity: ".concat(amenity, " is not a valid value"));
            }
        });
        return errorMessages;
    };
    RoomValidator.prototype.validateRoomPrice = function (price) {
        var errorMessages = [];
        if (typeof price !== "number") {
            errorMessages.push('Price is not a number');
        }
        if (price < 25) {
            errorMessages.push('Price must be 25$ or more');
        }
        if (price > 100000) {
            errorMessages.push('Price must be 100 000$ or less');
        }
        return errorMessages;
    };
    RoomValidator.prototype.validateRoomDiscount = function (discount) {
        var errorMessages = [];
        if (typeof discount !== "number") {
            errorMessages.push('Discount is not a number');
        }
        if (discount < 0) {
            errorMessages.push('Discount must be 0 or more');
        }
        if (discount > 100) {
            errorMessages.push('Discount must be 100 or less');
        }
        return errorMessages;
    };
    RoomValidator.prototype.validateBookingList = function (bookingList, allBookings, allRooms) {
        var errorMessages = [];
        var bookingValidator = new bookingValidator_1.BookingValidator();
        bookingList.map(function (booking) {
            if (booking === undefined || Object.keys(booking).length === 0) {
                errorMessages.push('Some room in room_list of bookings is undefined or empty');
                return;
            }
            bookingValidator.validateProperties(booking, false);
            bookingValidator.validateBooking(booking, allBookings, allRooms);
        });
        return errorMessages;
    };
    return RoomValidator;
}());
exports.RoomValidator = RoomValidator;
