"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientValidator = void 0;
// import { ClientArchived } from "../enums/clientArchived"
var ClientValidator = /** @class */ (function () {
    function ClientValidator() {
    }
    ClientValidator.prototype.validateProperties = function (client) {
        var errorMessages = [];
        var requiredProperties = ['publish_date', 'full_name', 'email', 'phone_number', 'comment', 'archived'];
        requiredProperties.map(function (property) {
            if (!(property in client)) {
                errorMessages.push("Property [".concat(property, "] is required in Client"));
            }
        });
        return errorMessages;
    };
    ClientValidator.prototype.validateClient = function (client) {
        var allErrorMessages = [];
        // const errorsCheckingProperties = this.validateProperties(client)
        // if (errorsCheckingProperties.length > 0) {
        //     return errorsCheckingProperties
        // }
        // validateDateRelativeToNow(new Date(client.publish_date), true, 'Publish date').map(
        //     error => allErrorMessages.push(error)
        // )
        // validateFullName(client.full_name, 'Full name').map(
        //     error => allErrorMessages.push(error)
        // )
        // validateEmail(client.email, 'Email').map(
        //     error => allErrorMessages.push(error)
        // )
        // validatePhoneNumber(client.phone_number, 'Phone Number').map(
        //     error => allErrorMessages.push(error)
        // )
        // validateTextArea(client.comment, 'Comment').map(
        //     error => allErrorMessages.push(error)
        // )
        // this.validateArchived(client.archived).map(
        //     error => allErrorMessages.push(error)
        // )
        return allErrorMessages;
    };
    ClientValidator.prototype.validateArchived = function (archived) {
        var errorMessages = [];
        if (typeof archived !== "string") {
            errorMessages.push('Archived is not a String');
        }
        // if (!Object.values(ClientArchived).includes(archived as ClientArchived)) {
        //     errorMessages.push('Archived is not a valid value')
        // }
        return errorMessages;
    };
    return ClientValidator;
}());
exports.ClientValidator = ClientValidator;
