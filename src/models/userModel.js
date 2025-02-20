"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
var userStatus_1 = require("../enums/userStatus");
var UserSchema = new mongoose_1.Schema({
    photo: {
        type: String,
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
    start_date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(userStatus_1.UserStatus)
    },
    password: {
        type: String,
        required: true
    }
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
