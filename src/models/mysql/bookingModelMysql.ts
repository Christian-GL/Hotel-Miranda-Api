
import { DataTypes, Model } from "sequelize"
import { sequelize } from '../../utils/databaseMysql'
import { BookingInterfaceMysql } from "../../interfaces/mysql/bookingInterfaceMysql"
import { RoomModelMysql } from "./roomModelMysql"


export class BookingModelMysql extends Model<BookingInterfaceMysql> {
    _id!: number
    photo!: string
    full_name_guest!: string
    order_date!: Date
    check_in_date!: Date
    check_out_date!: Date
    special_request!: string
    room_id!: number
}

BookingModelMysql.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        full_name_guest: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        check_in_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        check_out_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        special_request: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: RoomModelMysql,
                key: "_id",
            },
        },
    },
    {
        sequelize,
        tableName: "bookings",
        timestamps: false,
    }
)