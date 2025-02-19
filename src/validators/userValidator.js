"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
var userStatus_1 = require("../enums/userStatus");
var UserValidator = /** @class */ (function () {
    function UserValidator() {
    }
    UserValidator.prototype.validateProperties = function (user) {
        var errorMessages = [];
        var requiredProperties = ['photo', 'full_name', 'email', 'start_date', 'description', 'phone_number', 'status'];
        requiredProperties.map(function (property) {
            if (!(property in user)) {
                errorMessages.push("Property [".concat(property, "] is required in User"));
            }
        });
        return errorMessages;
    };
    UserValidator.prototype.validateUser = function (user) {
        var allErrorMessages = [];
        var checkProperties = this.validateProperties(user);
        if (checkProperties.length > 0) {
            return checkProperties;
        }
        // this.validatePhoto(user.photo).map(
        //     error => allErrorMessages.push(error)
        // )
        this.validateFullName(user.full_name).map(function (error) { return allErrorMessages.push(error); });
        this.validateEmail(user.email).map(function (error) { return allErrorMessages.push(error); });
        this.validateStartDate(user.start_date).map(function (error) { return allErrorMessages.push(error); });
        this.validateDescription(user.description).map(function (error) { return allErrorMessages.push(error); });
        this.validatePhoneNumber(user.phone_number).map(function (error) { return allErrorMessages.push(error); });
        this.validateStatusActive(user.status).map(function (error) { return allErrorMessages.push(error); });
        this.validatePassword(user.password).map(function (error) { return allErrorMessages.push(error); });
        return allErrorMessages;
    };
    UserValidator.prototype.validatePhoto = function (photo) {
        var errorMessages = [];
        var regex = /\.(png|jpg)$/i;
        if (typeof photo !== "string") {
            errorMessages.push('Photo url is not a String');
        }
        if (!regex.test(photo)) {
            errorMessages.push('Not .png or .jpg file');
        }
        return errorMessages;
    };
    UserValidator.prototype.validateFullName = function (fullName) {
        var errorMessages = [];
        var regex = new RegExp(/^[^\d]*$/);
        if (typeof fullName !== "string") {
            errorMessages.push('Name is not a String');
        }
        if (fullName.length < 3) {
            errorMessages.push('Name length must be 3 characters or more');
        }
        if (fullName.length > 50) {
            errorMessages.push('Name length must be 50 characters or less');
        }
        if (!regex.test(fullName)) {
            errorMessages.push('Name must not contain numbers');
        }
        return errorMessages;
    };
    UserValidator.prototype.validateEmail = function (email) {
        var errorMessages = [];
        var regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (typeof email !== "string") {
            errorMessages.push('Email is not a String');
        }
        if (!regex.test(email)) {
            errorMessages.push('Email format no valid');
        }
        return errorMessages;
    };
    UserValidator.prototype.validateStartDate = function (startDate) {
        var errorMessages = [];
        var parsedDate = new Date(startDate);
        if (isNaN(parsedDate.getTime())) {
            errorMessages.push('Start date is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)');
            return errorMessages;
        }
        var currentDate = new Date();
        if (parsedDate < currentDate) {
            errorMessages.push('Start date cant be before now');
        }
        return errorMessages;
    };
    UserValidator.prototype.validateDescription = function (description) {
        var errorMessages = [];
        if (typeof description !== "string") {
            errorMessages.push('Text is not a String');
        }
        if (description.length < 10) {
            errorMessages.push('Text length must be 10 characters or more');
        }
        if (description.length > 500) {
            errorMessages.push('Text length must be 500 characters or less');
        }
        return errorMessages;
    };
    UserValidator.prototype.validatePhoneNumber = function (phoneNumber) {
        var errorMessages = [];
        var regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/;
        if (typeof phoneNumber !== "string") {
            errorMessages.push('Phone number is not a String');
        }
        if (phoneNumber.length < 9) {
            errorMessages.push('Phone number length must be 9 characters or more');
        }
        if (phoneNumber.length > 20) {
            errorMessages.push('Phone number length must be 20 characters or less');
        }
        if (!regex.test(phoneNumber)) {
            errorMessages.push('Phone number only digits are available');
        }
        return errorMessages;
    };
    UserValidator.prototype.validateStatusActive = function (status) {
        var errorMessages = [];
        if (typeof status !== "string") {
            errorMessages.push('User status is not a String');
        }
        if (!Object.values(userStatus_1.UserStatus).includes(status)) {
            errorMessages.push('User status is not a valid value');
        }
        return errorMessages;
    };
    UserValidator.prototype.validatePassword = function (password) {
        var errorMessages = [];
        var regexUppercase = /[A-Z]/;
        var regexNumber = /\d/;
        var regexSymbols = /[*\-.,!@#$%^&*()_+={}|\[\]:;"'<>,.?/~`]/;
        if (password.length < 8 || password.length > 20) {
            errorMessages.push('Password length must be between 8 and 20 characters');
        }
        if (!regexUppercase.test(password)) {
            errorMessages.push('Password must contain at least one uppercase letter');
        }
        if (!regexNumber.test(password)) {
            errorMessages.push('Password must contain at least one number');
        }
        if (!regexSymbols.test(password)) {
            errorMessages.push('Password must contain at least one symbol (*, -, ., etc)');
        }
        return errorMessages;
    };
    return UserValidator;
}());
exports.UserValidator = UserValidator;
