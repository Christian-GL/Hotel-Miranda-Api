
import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'

dotenv.config()


export const sequelize = new Sequelize(process.env.MYSQL_URL || '', {
    dialect: 'mysql',
    logging: true,
})

export const connectMysqlDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
        console.log('Connected to MySQL')
    }
    catch (error) {
        console.error('Error trying to connect to MySQL', error)
        process.exit(1)
    }
}