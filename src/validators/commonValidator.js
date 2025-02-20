"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = exports.validateTextArea = exports.validateDate = exports.validateEmail = exports.validateFullName = exports.validatePhoto = void 0;
var validatePhoto = function (photo, fieldName) {
    if (fieldName === void 0) { fieldName = 'Photo'; }
    var errorMessages = [];
    var regex = /\.(png|jpg)$/i;
    if (typeof photo !== "string") {
        errorMessages.push("".concat(fieldName, " url is not a String"));
    }
    if (!regex.test(photo)) {
        errorMessages.push("".concat(fieldName, " is not .png or .jpg file"));
    }
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
var validateDate = function (startDate, fieldName) {
    if (fieldName === void 0) { fieldName = 'Date'; }
    var errorMessages = [];
    var parsedDate = new Date(startDate);
    if (isNaN(parsedDate.getTime())) {
        errorMessages.push("".concat(fieldName, " is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)"));
        return errorMessages;
    }
    // COMPROBAR ESTO PAREA TODAS LAS FECHAS ???
    // const currentDate = new Date()
    // if (parsedDate < currentDate) {
    //     errorMessages.push(`${fieldName} cant be before now`)
    // }
    return errorMessages;
};
exports.validateDate = validateDate;
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
    var regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/;
    if (typeof phoneNumber !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    if (phoneNumber.length < 9 || phoneNumber.length > 20) {
        errorMessages.push("".concat(fieldName, " length must be bertween 9 and 20 characters"));
    }
    if (!regex.test(phoneNumber)) {
        errorMessages.push("".concat(fieldName, " only digits are available"));
    }
    return errorMessages;
};
exports.validatePhoneNumber = validatePhoneNumber;
