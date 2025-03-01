"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomValidator = void 0;
var commonValidator_1 = require("./commonValidator");
var roomType_1 = require("../enums/roomType");
var roomAmenities_1 = require("../enums/roomAmenities");
var RoomValidator = /** @class */ (function () {
    function RoomValidator() {
    }
    RoomValidator.prototype.validateProperties = function (room) {
        var errorMessages = [];
        var requiredProperties = ['photos', 'number', 'type', 'amenities', 'price', 'discount', 'booking_list'];
        requiredProperties.forEach(function (property) {
            if (!(property in room)) {
                errorMessages.push("Property [".concat(property, "] is required in Room"));
            }
        });
        return errorMessages;
    };
    RoomValidator.prototype.validateNewRoom = function (room, allRooms) {
        var errorMessages = [];
        if (room === undefined || Object.keys(room).length === 0) {
            errorMessages.push('Room is undefined or empty');
            return errorMessages;
        }
        var errorsCheckingProperties = this.validateProperties(room);
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties;
        }
        // this.validatePhotos(room.photos).errorMessages.map(error => allErrorMessages.push(error))
        this.validateNewNumber(room.number, allRooms).map(function (error) { return errorMessages.push(error); });
        this.validateRoomType(room.type).map(function (error) { return errorMessages.push(error); });
        this.validateAmenities(room.amenities).map(function (error) { return errorMessages.push(error); });
        this.validateRoomPrice(room.price).map(function (error) { return errorMessages.push(error); });
        this.validateRoomDiscount(room.discount).map(function (error) { return errorMessages.push(error); });
        return errorMessages;
    };
    RoomValidator.prototype.validateExistingRoom = function (room, allRooms, allBookings) {
        var errorMessages = [];
        if (room === undefined || Object.keys(room).length === 0) {
            errorMessages.push('Room is undefined or empty');
            return errorMessages;
        }
        // this.validatePhotos(room.photos).errorMessages.map(error => allErrorMessages.push(error))
        this.validateExistingNumber(room.number, room.number, allRooms).map(function (error) { return errorMessages.push(error); });
        this.validateRoomType(room.type).map(function (error) { return errorMessages.push(error); });
        this.validateAmenities(room.amenities).map(function (error) { return errorMessages.push(error); });
        this.validateRoomPrice(room.price).map(function (error) { return errorMessages.push(error); });
        this.validateRoomDiscount(room.discount).map(function (error) { return errorMessages.push(error); });
        this.validateBookingList(room.booking_list, allBookings).map(function (error) { return errorMessages.push(error); });
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
    RoomValidator.prototype.validateNumber = function (number, allRooms, actualNumber) {
        var errorMessages = [];
        var regex = /^\d{3}$/;
        if (typeof number !== "string") {
            errorMessages.push('Number is not a string');
        }
        if (!regex.test(number)) {
            errorMessages.push('Number must have 3 numeric digits between 000 and 999');
        }
        if (allRooms.some(function (room) { return room.number === number && room.number !== actualNumber; })) {
            errorMessages.push('Number is already taken');
        }
        return errorMessages;
    };
    RoomValidator.prototype.validateNewNumber = function (number, allRooms) {
        return this.validateNumber(number, allRooms);
    };
    RoomValidator.prototype.validateExistingNumber = function (number, actualNumber, allRooms) {
        return this.validateNumber(number, allRooms, actualNumber);
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
    // DEBERIA SER ROOMAMENITIES[] y no STRING[]
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
    RoomValidator.prototype.validateBookingList = function (bookingList, allBookings) {
        var errorMessages = [];
        bookingList.forEach(function (bookingId) {
            (0, commonValidator_1.validateIDstring)(bookingId, 'ID').map(function (error) {
                errorMessages.push(error);
            });
            var bookingExists = allBookings.some(function (booking) { return booking._id.toString() === bookingId; });
            if (!bookingExists) {
                errorMessages.push("Booking with ID #".concat(bookingId, " does not exist"));
            }
        });
        return errorMessages;
    };
    return RoomValidator;
}());
exports.RoomValidator = RoomValidator;
