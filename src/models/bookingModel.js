"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
var mongoose_1 = require("mongoose");
var BookingSchema = new mongoose_1.Schema({
    photo: {
        type: String,
        required: true
    },
    full_name_guest: {
        type: String,
        required: true
    },
    order_date: {
        type: Date,
        required: true
    },
    check_in_date: {
        type: Date,
        required: true
    },
    check_out_date: {
        type: Date,
        required: true
    },
    special_request: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    }
});
exports.BookingModel = (0, mongoose_1.model)('Booking', BookingSchema);
