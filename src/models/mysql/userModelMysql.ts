
import { DataTypes, Model } from "sequelize"
import { sequelize } from '../../utils/databaseMysql'
import { UserInterfaceMysql } from "../../interfaces/mysql/userInterfaceMysql"
import { UserStatus } from "../../enums/userStatus"


export class UserModelMysql extends Model<UserInterfaceMysql> {
    _id!: number
    photo!: string
    full_name!: string
    email!: string
    start_date!: Date
    description!: string
    phone_number!: string
    status!: UserStatus
    password!: string
}

UserModelMysql.init(
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
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(UserStatus)),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: false
    }
)