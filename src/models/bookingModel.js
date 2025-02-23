"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
var mongoose_1 = require("mongoose");
var bookingStatus_1 = require("../enums/bookingStatus");
var roomType_1 = require("../enums/roomType");
var roomAmenities_1 = require("../enums/roomAmenities");
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
    status: {
        type: String,
        required: true,
        enum: Object.values(bookingStatus_1.BookingStatus)
    },
    special_request: {
        type: String,
        required: true
    },
    room_list: [{
            number: { type: String, required: true },
            photos: { type: [String], required: true },
            type: { type: String, required: true, enum: Object.values(roomType_1.RoomType) },
            amenities: { type: [String], required: true, enum: Object.values(roomAmenities_1.RoomAmenities) },
            price: { type: Number, required: true },
            discount: { type: Number, required: true }
        }]
    // room_list: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "Room",
    //     required: true
    // }]
});
exports.BookingModel = (0, mongoose_1.model)('Booking', BookingSchema);
