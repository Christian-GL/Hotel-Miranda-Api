"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidator = void 0;
var commonValidator_1 = require("./commonValidator");
var ContactValidator = /** @class */ (function () {
    function ContactValidator() {
    }
    ContactValidator.prototype.validateProperties = function (contact) {
        var errorMessages = [];
        var requiredProperties = ['publish_date', 'full_name', 'email', 'phone_number', 'comment', 'archived'];
        requiredProperties.map(function (property) {
            if (!(property in contact)) {
                errorMessages.push("Property [".concat(property, "] is required in Contact"));
            }
        });
        return errorMessages;
    };
    ContactValidator.prototype.validateContact = function (contact) {
        var allErrorMessages = [];
        var errorsCheckingProperties = this.validateProperties(contact);
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties;
        }
        (0, commonValidator_1.validateDateRelativeToNow)(new Date(contact.publish_date), true, 'Publish date').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateFullName)(contact.full_name, 'Full name').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateEmail)(contact.email, 'Email').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validatePhoneNumber)(contact.phone_number, 'Phone Number').map(function (error) { return allErrorMessages.push(error); });
        (0, commonValidator_1.validateTextArea)(contact.comment, 'Comment').map(function (error) { return allErrorMessages.push(error); });
        this.validateArchived(contact.archived).map(function (error) { return allErrorMessages.push(error); });
        return allErrorMessages;
    };
    ContactValidator.prototype.validateArchived = function (archived) {
        var errorMessages = [];
        if (typeof archived !== "boolean") {
            errorMessages.push('Archived is not a Boolean');
        }
        return errorMessages;
    };
    return ContactValidator;
}());
exports.ContactValidator = ContactValidator;
