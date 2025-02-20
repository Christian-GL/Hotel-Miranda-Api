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
var database_1 = require("./utils/database");
var hashPassword_1 = require("./utils/hashPassword");
var roomModel_1 = require("./models/roomModel");
var contactModel_1 = require("./models/contactModel");
var userModel_1 = require("./models/userModel");
var roomValidator_1 = require("./validators/roomValidator");
var contactValidator_1 = require("./validators/contactValidator");
var userValidator_1 = require("./validators/userValidator");
var userStatus_1 = require("./enums/userStatus");
var roomType_1 = require("./enums/roomType");
var roomAmenities_1 = require("./enums/roomAmenities");
var createUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users, userValidator, totalErrors, i, fakeUser, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
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
                if (!(i < 10)) return [3 /*break*/, 7];
                fakeUser = new userModel_1.UserModel({
                    photo: faker_1.faker.image.avatar(),
                    full_name: faker_1.faker.person.fullName(),
                    email: faker_1.faker.internet.email(),
                    start_date: faker_1.faker.date.future(),
                    description: faker_1.faker.lorem.paragraph(),
                    phone_number: faker_1.faker.string.numeric(9),
                    status: faker_1.faker.helpers.arrayElement(Object.values(userStatus_1.UserStatus)),
                    password: 'Abcd1234.'
                });
                totalErrors = userValidator.validateUser(fakeUser.toObject());
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
            case 7: return [4 /*yield*/, userModel_1.UserModel.insertMany(users)];
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
// createUsers()
var createContacts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var contacts, contactValidator, totalErrors, i, fakeContact, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                contacts = [];
                contactValidator = new contactValidator_1.ContactValidator();
                totalErrors = void 0;
                for (i = 0; i < 10; i++) {
                    fakeContact = new contactModel_1.ContactModel({
                        full_name: faker_1.faker.person.fullName(),
                        email: faker_1.faker.internet.email(),
                        publish_date: faker_1.faker.date.past(),
                        phone_number: faker_1.faker.string.numeric(9),
                        comment: faker_1.faker.lorem.paragraph()
                    });
                    totalErrors = contactValidator.validateContact(fakeContact.toObject());
                    if (totalErrors.length === 0) {
                        contacts.push(fakeContact);
                    }
                    else {
                        console.error("Validaci\u00F3n fallida en el fakeContact #".concat(i, ": ").concat(totalErrors.join(', ')));
                        continue;
                    }
                }
                return [4 /*yield*/, contactModel_1.ContactModel.insertMany(contacts)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error('Error creating contacts with faker', error_2);
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); };
// createContacts()
var createRooms = function () { return __awaiter(void 0, void 0, void 0, function () {
    var rooms, roomValidator, totalErrors, i, fakeRoom, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.connectDB)()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                rooms = [];
                roomValidator = new roomValidator_1.RoomValidator();
                totalErrors = void 0;
                for (i = 0; i < 10; i++) {
                    fakeRoom = new roomModel_1.RoomModel({
                        photos: Array.from({ length: 3 }, function () { return faker_1.faker.image.avatar(); }),
                        number: faker_1.faker.number.int({ min: 0, max: 999 }).toString().padStart(3, "0"),
                        type: faker_1.faker.helpers.arrayElement(Object.values(roomType_1.RoomType)),
                        amenities: faker_1.faker.helpers.arrayElements(Object.values(roomAmenities_1.RoomAmenities), faker_1.faker.number.int({ min: 3, max: 10 })),
                        price: faker_1.faker.number.float({ min: 25, max: 100000, fractionDigits: 2 }),
                        discount: faker_1.faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
                        // booking_list: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => faker.number.int({ min: 1, max: 10 }))
                        booking_list: []
                    });
                    totalErrors = roomValidator.validateRoom(fakeRoom.toObject());
                    if (totalErrors.length === 0) {
                        rooms.push(fakeRoom);
                    }
                    else {
                        console.error("Validaci\u00F3n fallida en el fakeRoom #".concat(i, ": ").concat(totalErrors.join(', ')));
                        continue;
                    }
                }
                return [4 /*yield*/, roomModel_1.RoomModel.insertMany(rooms)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error('Error creating rooms with faker', error_3);
                throw error_3;
            case 5: return [2 /*return*/];
        }
    });
}); };
createRooms();
