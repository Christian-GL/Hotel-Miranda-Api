"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
var mongoose_1 = require("mongoose");
var ContactSchema = new mongoose_1.Schema({
    publish_date: {
        type: Date,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    archived: {
        type: Boolean,
        required: true
    }
});
exports.ContactModel = (0, mongoose_1.model)('Contact', ContactSchema);
