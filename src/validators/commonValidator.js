"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = exports.validateTextArea = exports.validateDateRelativeToNow = exports.validateDate = exports.validateEmail = exports.validateFullName = exports.validateIDstring = exports.validateIDObjectId = exports.validatePhoto = void 0;
var mongoose_1 = require("mongoose");
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
var validateIDObjectId = function (id, fieldName) {
    if (fieldName === void 0) { fieldName = '_ID'; }
    var errorMessages = [];
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        errorMessages.push("".concat(fieldName, " is not a valid ObjectId"));
    }
    return errorMessages;
};
exports.validateIDObjectId = validateIDObjectId;
var validateIDstring = function (id, fieldName) {
    if (fieldName === void 0) { fieldName = 'ID'; }
    var errorMessages = [];
    if (typeof id !== "string") {
        errorMessages.push("".concat(fieldName, " is not a String"));
    }
    return errorMessages;
};
exports.validateIDstring = validateIDstring;
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
    if (isNaN(date.getTime())) {
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
    (0, exports.validateDate)(date, 'Date').map(function (error) { return errorMessages.push(error); });
    if (mustBeBeforeNow && date > currentTime) {
        errorMessages.push("".concat(fieldName, " can't be after now"));
    }
    if (!mustBeBeforeNow && date < currentTime) {
        errorMessages.push("".concat(fieldName, " can't be before now"));
    }
    return errorMessages;
};
exports.validateDateRelativeToNow = validateDateRelativeToNow;
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
