"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var databaseMongodb_1 = require("./src/utils/databaseMongodb");
var hashPassword_1 = require("./src/utils/hashPassword");
var bookingModelMongodb_1 = require("./src/models/mongodb/bookingModelMongodb");
var roomModelMongodb_1 = require("./src/models/mongodb/roomModelMongodb");
var clientModelMongodb_1 = require("./src/models/mongodb/clientModelMongodb");
var userModelMongodb_1 = require("./src/models/mongodb/userModelMongodb");
var bookingValidator_1 = require("./src/validators/bookingValidator");
var roomValidator_1 = require("./src/validators/roomValidator");
var clientValidator_1 = require("./src/validators/clientValidator");
var userValidator_1 = require("./src/validators/userValidator");
var roomType_1 = require("./src/enums/roomType");
var roomAmenities_1 = require("./src/enums/roomAmenities");
var role_1 = require("./src/enums/role");
var createUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users, userValidator, totalErrors, i, dayMs, now, oneYearFromNow, startDate, minEnd, maxEnd, endDate, fakeUser, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, databaseMongodb_1.connectMongodbDB)()];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 9, , 10]);
                users = [];
                userValidator = new userValidator_1.UserValidator();
                totalErrors = void 0;
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < 5)) return [3 /*break*/, 7];
                dayMs = 24 * 60 * 60 * 1000;
                now = new Date();
                oneYearFromNow = new Date(now.getTime() + 365 * dayMs);
                startDate = faker_1.faker.date.between({
                    from: now,
                    to: oneYearFromNow
                });
                minEnd = new Date(startDate.getTime() + 30 * dayMs);
                maxEnd = new Date(startDate.getTime() + 365 * dayMs);
                endDate = faker_1.faker.date.between({
                    from: minEnd,
                    to: maxEnd
                });
                fakeUser = new userModelMongodb_1.UserModelMongodb({
                    photo: faker_1.faker.image.avatar(),
                    full_name: faker_1.faker.person.fullName(),
                    email: faker_1.faker.internet.email(),
                    phone_number: faker_1.faker.string.numeric(9),
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    job_position: faker_1.faker.lorem.paragraph(),
                    role: faker_1.faker.helpers.arrayElement(Object.values(role_1.Role)),
                    password: 'Abcd1234.'
                });
                totalErrors = userValidator.validateUser(fakeUser.toObject(), true);
                if (!(totalErrors.length === 0)) return [3 /*break*/, 5];
                _a = fakeUser;
                return [4 /*yield*/, (0, hashPassword_1.hashPassword)(fakeUser.password)];
            case 4:
                _a.password = _b.sent();
                users.push(fakeUser);
                return [3 /*break*/, 6];
            case 5:
                console.error("Validaci\u00F3n fallida en el fakeUser #".concat(i, ": ").concat(totalErrors.join(', ')));
                return [3 /*break*/, 6];
            case 6:
                i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, userModelMongodb_1.UserModelMongodb.insertMany(users)];
            case 8:
                _b.sent();
                return [3 /*break*/, 10];
            case 9:
                error_1 = _b.sent();
                console.error('Error creating users with faker', error_1);
                throw error_1;
            case 10: return [2 /*return*/];
        }
    });
}); };
var createClients = function () { return __awaiter(void 0, void 0, void 0, function () {
    var clients, clientValidator, totalErrors, i, fakeContact, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, databaseMongodb_1.connectMongodbDB)()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                clients = [];
                clientValidator = new clientValidator_1.ClientValidator();
                totalErrors = void 0;
                for (i = 0; i < 25; i++) {
                    fakeContact = new clientModelMongodb_1.ClientModelMongodb({
                        full_name: faker_1.faker.person.fullName(),
                        email: faker_1.faker.internet.email(),
                        publish_date: faker_1.faker.date.past().toISOString(),
                        phone_number: faker_1.faker.string.numeric(9),
                        comment: faker_1.faker.lorem.paragraph(),
                        archived: faker_1.faker.datatype.boolean()
                    });
                    totalErrors = clientValidator.validateClient(fakeContact.toObject());
                    if (totalErrors.length === 0) {
                        clients.push(fakeContact);
                    }
                    else {
                        console.error("Validaci\u00F3n fallida en el fakeContact #".concat(i, ": ").concat(totalErrors.join(', ')));
                        continue;
                    }
                }
                return [4 /*yield*/, clientModelMongodb_1.ClientModelMongodb.insertMany(clients)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error('Error creating clients with faker', error_2);
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); };
var createRoomsAndBookings = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rooms, bookings, roomValidator, bookingValidator, roomTotalErrors, bookingTotalErrors, i, fakeRoom, i, selectedRoom, check_in_date, fakeBooking, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, databaseMongodb_1.connectMongodbDB)()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                rooms = [];
                bookings = [];
                roomValidator = new roomValidator_1.RoomValidator();
                bookingValidator = new bookingValidator_1.BookingValidator();
                roomTotalErrors = [];
                bookingTotalErrors = [];
                for (i = 0; i < 5; i++) {
                    fakeRoom = new roomModelMongodb_1.RoomModelMongodb({
                        photos: Array.from({ length: 3 }, function () { return faker_1.faker.image.urlPicsumPhotos(); }),
                        number: faker_1.faker.number.int({ min: 0, max: 999 }).toString().padStart(3, "0"),
                        type: faker_1.faker.helpers.arrayElement(Object.values(roomType_1.RoomType)),
                        amenities: faker_1.faker.helpers.arrayElements(Object.values(roomAmenities_1.RoomAmenities), faker_1.faker.number.int({ min: 3, max: 10 })),
                        price: faker_1.faker.number.float({ min: 25, max: 100000, fractionDigits: 2 }),
                        discount: faker_1.faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
                        booking_id_list: []
                    });
                    roomTotalErrors = roomValidator.validateNewRoom(fakeRoom.toObject(), rooms);
                    if (roomTotalErrors.length === 0) {
                        rooms.push(fakeRoom);
                    }
                    else {
                        console.error("Validaci\u00F3n fallida en el fakeRoom #".concat(i, ": ").concat(roomTotalErrors.join(', ')));
                        continue;
                    }
                }
                for (i = 0; i < 75; i++) {
                    if (rooms.length === 0)
                        break;
                    selectedRoom = faker_1.faker.helpers.arrayElement(rooms);
                    check_in_date = faker_1.faker.date.future({ years: faker_1.faker.number.float({ min: 0.2, max: 2 }) });
                    fakeBooking = new bookingModelMongodb_1.BookingModelMongodb({
                        photo: faker_1.faker.image.avatar(),
                        full_name_guest: faker_1.faker.person.fullName(),
                        order_date: faker_1.faker.date.recent({ days: 30 }).toISOString(),
                        check_in_date: check_in_date.toISOString(),
                        check_out_date: faker_1.faker.date.future({ years: faker_1.faker.number.float({ min: 0.1, max: 2 }), refDate: check_in_date }).toISOString(),
                        special_request: faker_1.faker.lorem.sentence(faker_1.faker.number.int({ min: 10, max: 40 })),
                        room_id: selectedRoom._id.toString()
                    });
                    bookingTotalErrors = bookingValidator.validateBooking(fakeBooking.toObject(), bookings, rooms);
                    if (bookingTotalErrors.length === 0) {
                        bookings.push(fakeBooking);
                        selectedRoom.booking_id_list.push(fakeBooking._id.toString());
                    }
                    else {
                        console.error("Validaci\u00F3n fallida en el fakeBooking #".concat(i, ": ").concat(bookingTotalErrors.join(', ')));
                        continue;
                    }
                }
                // rooms.map(room => {
                //     console.log(room._id, room.number, room.booking_list)
                // })
                // console.log('=============')
                // bookings.map(booking => {
                //     console.log(booking._id, booking.room_id)
                // })
                return [4 /*yield*/, roomModelMongodb_1.RoomModelMongodb.insertMany(rooms)];
            case 3:
                // rooms.map(room => {
                //     console.log(room._id, room.number, room.booking_list)
                // })
                // console.log('=============')
                // bookings.map(booking => {
                //     console.log(booking._id, booking.room_id)
                // })
                _a.sent();
                return [4 /*yield*/, bookingModelMongodb_1.BookingModelMongodb.insertMany(bookings)];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('Error creating bookings and rooms with faker', error_3);
                throw error_3;
            case 6: return [2 /*return*/];
        }
    });
}); };
// createUsers()
// createClients()
// createRoomsAndBookings()
// Ejecutar fichero Seed:
// npx tsc seedMongodb.ts
// node seedMongodb.js
