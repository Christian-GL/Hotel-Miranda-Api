
import { DataTypes, Model } from "sequelize"
import { sequelize } from '../../utils/databaseMysql'
import { ContactInterfaceMysql } from "../../interfaces/mysql/contactInterfaceMysql"
import { ContactArchived } from "../../enums/contactArchived"


export class ContactModelMysql extends Model<ContactInterfaceMysql> {
    _id!: number
    publish_date!: Date
    full_name!: string
    email!: string
    phone_number!: string
    comment!: string
    archived!: ContactArchived
}

ContactModelMysql.init(
    {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        publish_date: {
            type: DataTypes.DATE,
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
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        archived: {
            type: DataTypes.ENUM(...Object.values(ContactArchived)),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "contacts",
        timestamps: false
    }
)