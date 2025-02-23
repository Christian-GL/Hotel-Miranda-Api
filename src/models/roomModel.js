"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
var mongoose_1 = require("mongoose");
var roomType_1 = require("../enums/roomType");
var roomAmenities_1 = require("../enums/roomAmenities");
var bookingStatus_1 = require("../enums/bookingStatus");
var RoomSchema = new mongoose_1.Schema({
    photos: {
        type: [String],
        required: true
    },
    number: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(roomType_1.RoomType)
    },
    amenities: {
        type: [String],
        required: true,
        enum: Object.values(roomAmenities_1.RoomAmenities)
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    booking_list: [{
            photo: { type: String, required: true },
            full_name_guest: { type: String, required: true },
            order_date: { type: Date, required: true },
            check_in_date: { type: Date, required: true },
            check_out_date: { type: Date, required: true },
            status: { type: String, required: true, enum: Object.values(bookingStatus_1.BookingStatus) },
            special_request: { type: String, required: true }
        }]
});
exports.RoomModel = (0, mongoose_1.model)('Room', RoomSchema);
