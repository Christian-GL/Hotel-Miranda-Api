
import { DataTypes, Model } from "sequelize"
import { sequelize } from '../../utils/databaseMysql'
import { RoomInterfaceMysql } from "../../interfaces/mysql/roomInterfaceMysql"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"


export class RoomModelMysql extends Model<RoomInterfaceMysql> {
    _id!: number
    photos!: string[]
    number!: string
    type!: RoomType
    amenities!: RoomAmenities[]
    price!: number
    discount!: number
    booking_id_list!: number[]
}

RoomModelMysql.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        photos: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [Object.values(RoomType)],
            },
        },
        amenities: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        discount: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        booking_id_list: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "rooms",
        timestamps: false
    }
)