"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExistingRoomNumber = exports.validateNewRoomNumber = exports.validateAmenities = exports.validateRoomType = exports.validateNumberBetween = exports.validateCreatePassword = exports.validateBoolean = exports.validatePhoneNumber = exports.validateTextArea = exports.validateDateIsOccupiedIfBookingExists = exports.validateDateIsOccupied = exports.validateCheckInCheckOut = exports.validateDateRelativeToNow = exports.validateDate = exports.validateEmail = exports.validateFullName = exports.validatePhoto = exports.validatePhotos = void 0;
var roomType_1 = require("../enums/roomType");
var roomAmenities_1 = require("../enums/roomAmenities");
var validatePhotos = function (photos, fieldName) {
    if (fieldName === void 0) { fieldName = 'Photo'; }
    var errorMessages = [];
    // const regex = /\.(png|jpe?g)$/i
    photos.forEach(function (photo, index) {
        if (typeof photo !== "string") {
            errorMessages.push("".concat(fieldName, " ").concat(index, " url is not a String"));
        }
        // if (!regex.test(photo)) {
        //     errorMessages.push(`${fieldName} ${index} is not .png .jpg .jpeg file`)
        // }
    });
    if (photos[0] === undefined) {
        errorMessages.push("Main ".concat(fieldName, " need to be set"));
    }
    if (photos.length < 3) {
        errorMessages.push("".concat(fieldName, "s need to be at least 3"));
    }
    return errorMessages;
};
exports.validatePhotos = validatePhotos;
var validatePhoto = function (photo, fieldName) {
    if (fieldName === void 0) { fieldName = 'Photo'; }
    var errorMessages = [];
    // const regex = /\.(png|jpe?g)$/i
    if (photo === null || photo === undefined) {
        errorMessages.push("".concat(fieldName, " is required"));
    }
    if (typeof photo !== "string") {
        errorMessages.push("".concat(fieldName, " url is not a String"));
    }
    // if (!regex.test(photo)) {
    //     errorMessages.push(`${fieldName} is not .png .jpg .jpeg file`)
    // }
    return errorMessages;
};
exports.validatePhoto = validatePhoto;
var validateFullName = function (fullName, fieldName) {
    if (fieldName === void 0) { fieldName = 'Full name'; }
    var errorMessages = [];
    var regex = new RegExp(/^[^\d]*$/);
    if (typeof fullName !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (fullName.length < 3 || fullName.length > 50) {
        errorMessages.push("".concat(fieldName, " length must be between 3 and 50 characters"));
    }
    if (!regex.test(fullName)) {
        errorMessages.push("".concat(fieldName, " must not contain numbers"));
    }
    return errorMessages;
};
exports.validateFullName = validateFullName;
var validateEmail = function (email, fieldName) {
    if (fieldName === void 0) { fieldName = 'Email'; }
    var errorMessages = [];
    var regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (typeof email !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (!regex.test(email)) {
        errorMessages.push("".concat(fieldName, " format no valid"));
    }
    return errorMessages;
};
exports.validateEmail = validateEmail;
var validateDate = function (date, fieldName) {
    if (fieldName === void 0) { fieldName = 'Date'; }
    var errorMessages = [];
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        errorMessages.push("".concat(fieldName, " is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)"));
        return errorMessages;
    }
    return errorMessages;
};
exports.validateDate = validateDate;
var validateDateRelativeToNow = function (date, mustBeBeforeNow, fieldName) {
    if (fieldName === void 0) { fieldName = 'Date'; }
    var errorMessages = [];
    var currentTime = new Date();
    (0, exports.validateDate)(date, 'Date').map(function (error) {
        errorMessages.push(error);
        return errorMessages;
    });
    if (mustBeBeforeNow && date > currentTime) {
        errorMessages.push("".concat(fieldName, " can't be after now"));
    }
    if (!mustBeBeforeNow && date < currentTime) {
        errorMessages.push("".concat(fieldName, " can't be before now"));
    }
    return errorMessages;
};
exports.validateDateRelativeToNow = validateDateRelativeToNow;
var validateCheckInCheckOut = function (checkIn, checkOut) {
    var errorMessages = [];
    (0, exports.validateDateRelativeToNow)(checkIn, false, 'Check in date').map(function (error) { return errorMessages.push(error); });
    (0, exports.validateDateRelativeToNow)(checkOut, false, 'Check out date').map(function (error) { return errorMessages.push(error); });
    if (checkIn >= checkOut) {
        errorMessages.push('Check in date must be before Check out date');
    }
    return errorMessages;
};
exports.validateCheckInCheckOut = validateCheckInCheckOut;
var validateDateIsOccupied = function (booking, bookings) {
    var errorMessages = [];
    for (var i = 0; i < bookings.length; i++) {
        if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
            new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
            errorMessages.push("This period is already occupied by booking #".concat(bookings[i]._id));
        }
    }
    return errorMessages;
};
exports.validateDateIsOccupied = validateDateIsOccupied;
var validateDateIsOccupiedIfBookingExists = function (booking, bookings) {
    var errorMessages = [];
    for (var i = 0; i < bookings.length; i++) {
        if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
            new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
            if (booking._id.toString() !== bookings[i]._id.toString()) {
                errorMessages.push("This period is already occupied by booking #".concat(bookings[i]._id));
            }
        }
    }
    return errorMessages;
};
exports.validateDateIsOccupiedIfBookingExists = validateDateIsOccupiedIfBookingExists;
var validateTextArea = function (textArea, fieldName) {
    if (fieldName === void 0) { fieldName = 'Text area'; }
    var errorMessages = [];
    if (typeof textArea !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (textArea.length < 10 || textArea.length > 500) {
        errorMessages.push("".concat(fieldName, " length must be between 10 and 500 characters"));
    }
    return errorMessages;
};
exports.validateTextArea = validateTextArea;
var validatePhoneNumber = function (phoneNumber, fieldName) {
    if (fieldName === void 0) { fieldName = 'Phone number'; }
    var errorMessages = [];
    var regex = /^\+?\d{1,4}([-\s]?\d{2,4})+$/;
    if (typeof phoneNumber !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (phoneNumber.length < 9 || phoneNumber.length > 20) {
        errorMessages.push("".concat(fieldName, " length must be between 9 and 20 characters"));
    }
    if (!regex.test(phoneNumber)) {
        errorMessages.push("".concat(fieldName, " only [digits, -, +, spaces] are available"));
    }
    return errorMessages;
};
exports.validatePhoneNumber = validatePhoneNumber;
var validateBoolean = function (bool, fieldName) {
    if (fieldName === void 0) { fieldName = 'Bool field'; }
    var errorMessages = [];
    if (typeof bool !== "boolean") {
        errorMessages.push("".concat(fieldName, " is not a Boolean"));
    }
    return errorMessages;
};
exports.validateBoolean = validateBoolean;
var validateCreatePassword = function (password, fieldName) {
    if (fieldName === void 0) { fieldName = 'Password'; }
    var errorMessages = [];
    var regexUppercase = /[A-Z]/;
    var regexNumber = /\d/;
    var regexSymbols = /[*\-.,!@#$%^&*()_+={}|\[\]:;"'<>,.?/~`]/;
    if (typeof password !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (password.length < 8 || password.length > 20) {
        errorMessages.push("".concat(fieldName, " length must be between 8 and 20 characters"));
    }
    if (!regexUppercase.test(password)) {
        errorMessages.push("".concat(fieldName, " must contain at least one uppercase letter"));
    }
    if (!regexNumber.test(password)) {
        errorMessages.push("".concat(fieldName, " must contain at least one number"));
    }
    if (!regexSymbols.test(password)) {
        errorMessages.push("".concat(fieldName, " must contain at least one symbol (*, -, ., etc)"));
    }
    return errorMessages;
};
exports.validateCreatePassword = validateCreatePassword;
var validateNumberBetween = function (price, minor, mayor, fieldName) {
    if (fieldName === void 0) { fieldName = 'Number'; }
    var errorMessages = [];
    if (price === null || typeof price !== "number" || isNaN(price)) {
        errorMessages.push("".concat(fieldName, " is not a number"));
        return errorMessages;
    }
    if (price < minor) {
        errorMessages.push("".concat(fieldName, " must be ").concat(minor, " or more"));
    }
    if (price > mayor) {
        errorMessages.push("".concat(fieldName, " must be ").concat(mayor, " or less"));
    }
    return errorMessages;
};
exports.validateNumberBetween = validateNumberBetween;
var validateRoomType = function (type, fieldName) {
    if (fieldName === void 0) { fieldName = 'Room type'; }
    var errorMessages = [];
    if (typeof type !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (!Object.values(roomType_1.RoomType).includes(type)) {
        errorMessages.push("".concat(fieldName, " is not set"));
    }
    return errorMessages;
};
exports.validateRoomType = validateRoomType;
var validateAmenities = function (amenities, fieldName) {
    if (fieldName === void 0) { fieldName = 'Amenities'; }
    var errorMessages = [];
    if (!Array.isArray(amenities)) {
        errorMessages.push("".concat(fieldName, " is not an array of strings"));
        return errorMessages;
    }
    amenities.map(function (amenity) {
        if (!Object.values(roomAmenities_1.RoomAmenities).includes(amenity)) {
            errorMessages.push("".concat(fieldName, ": ").concat(amenity, " is not a valid value"));
        }
    });
    return errorMessages;
};
exports.validateAmenities = validateAmenities;
var validateRoomNumber = function (number, allRooms, actualNumber, fieldName) {
    if (fieldName === void 0) { fieldName = 'Room number'; }
    var errorMessages = [];
    var regex = new RegExp(/^\d{3}$/);
    if (!Array.isArray(allRooms)) {
        errorMessages.push("".concat(fieldName, ": invalid room list"));
        return errorMessages;
    }
    if (typeof number !== "string") {
        errorMessages.push("".concat(fieldName, " is not a string"));
    }
    var numStr = String(number);
    if (!regex.test(numStr)) {
        errorMessages.push("".concat(fieldName, " must have 3 numeric digits between 000 and 999"));
    }
    if (allRooms.some(function (room) { return room.number === numStr && room.number !== actualNumber; })) {
        errorMessages.push('Number is already taken');
    }
    return errorMessages;
};
var validateNewRoomNumber = function (number, allRooms, fieldName) {
    if (fieldName === void 0) { fieldName = 'Room number'; }
    return validateRoomNumber(number, allRooms, undefined, fieldName);
};
exports.validateNewRoomNumber = validateNewRoomNumber;
var validateExistingRoomNumber = function (number, actualNumber, allRooms, fieldName) {
    if (fieldName === void 0) { fieldName = 'Room number'; }
    return validateRoomNumber(number, allRooms, actualNumber, fieldName);
};
exports.validateExistingRoomNumber = validateExistingRoomNumber;
