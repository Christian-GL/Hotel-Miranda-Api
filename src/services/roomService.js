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
exports.RoomService = void 0;
var roomModel_1 = require("../models/roomModel");
var bookingModel_1 = require("../models/bookingModel");
var RoomService = /** @class */ (function () {
    function RoomService() {
    }
    RoomService.prototype.fetchAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rooms, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, roomModel_1.RoomModel.find()];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, rooms];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in fetchAll of roomService', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.prototype.fetchById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var room, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, roomModel_1.RoomModel.findById(id)];
                    case 1:
                        room = _a.sent();
                        if (room)
                            return [2 /*return*/, room];
                        else
                            throw new Error('Room not found');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in fetchById of roomService', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.prototype.create = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoom, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newRoom = new roomModel_1.RoomModel(room);
                        return [4 /*yield*/, newRoom.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newRoom];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error in create of roomService', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.prototype.update = function (id, room) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRoom, updatedRoom, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.fetchById(id)];
                    case 1:
                        existingRoom = _a.sent();
                        if (existingRoom == null)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, roomModel_1.RoomModel.findOneAndUpdate({ _id: id }, room, { new: true })];
                    case 2:
                        updatedRoom = _a.sent();
                        if (updatedRoom === null)
                            return [2 /*return*/, null];
                        return [2 /*return*/, updatedRoom];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error in update of roomService', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedRoom, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, roomModel_1.RoomModel.findByIdAndDelete(id)];
                    case 1:
                        deletedRoom = _a.sent();
                        if (!deletedRoom) return [3 /*break*/, 4];
                        return [4 /*yield*/, bookingModel_1.BookingModel.updateMany({ 'room_id.id': id }, { $pull: { room_id: { id: id } } })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, bookingModel_1.BookingModel.deleteMany({
                                'room_id.id': id,
                                $expr: { $eq: [{ $size: '$room_id' }, 1] }
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        console.error('Error in delete of roomService', error_5);
                        throw error_5;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return RoomService;
}());
exports.RoomService = RoomService;
