"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModelMongodb = void 0;
var mongoose_1 = require("mongoose");
var contactArchived_1 = require("../../enums/contactArchived");
var ContactSchemaMongodb = new mongoose_1.Schema({
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
        type: String,
        required: true,
        enum: Object.values(contactArchived_1.ContactArchived)
    }
});
exports.ContactModelMongodb = (0, mongoose_1.model)('Contact', ContactSchemaMongodb);
