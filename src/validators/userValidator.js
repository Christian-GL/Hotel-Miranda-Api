"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
var commonValidator_1 = require("./commonValidator");
var userStatus_1 = require("../enums/userStatus");
var UserValidator = /** @class */ (function () {
    function UserValidator() {
    }
    UserValidator.prototype.validateProperties = function (user) {
        var errorMessages = [];
        var requiredProperties = ['photo', 'full_name', 'email', 'start_date', 'description', 'phone_number', 'status', 'password'];
        requiredProperties.map(function (property) {
            if (!(property in user)) {
                errorMessages.push("Property [".concat(property, "] is required in User"));
            }
        });
        // Object.keys(user).map((key) => {
        //     if (!requiredProperties.includes(key)) {
        //         errorMessages.push(`Unexpected property [${key}] found in User`);
        //     }
        // })
        return errorMessages;
    };
    UserValidator.prototype.validateUser = function (user, passwordHasChanged) {
        if (passwordHasChanged === void 0) { passwordHasChanged = false; }
        var allErrorMessages = [];
        var errorsCheckingProperties = this.validateProperties(user);
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties;
        }
        // validatePhoto(user.photo, 'Photo').map(
        //     error => allErrorMessages.push(error)
        // )
        (0, commonValidator_1.validateFullName)(user.full_name, 'Full name').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateEmail)(user.email, 'Email').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateDateRelativeToNow)(new Date(user.start_date), false, 'Start date').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateTextArea)(user.description, 'Description').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validatePhoneNumber)(user.phone_number, 'Phone number').map(function (error) { return allErrorMessages.push(error); });
        this.validateStatusActive(user.status).map(function (error) { return allErrorMessages.push(error); });
        if (passwordHasChanged) {
            this.validateNewPassword(user.password).map(function (error) { return allErrorMessages.push(error); });
        }
        return allErrorMessages;
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
    UserValidator.prototype.validateNewPassword = function (password) {
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
