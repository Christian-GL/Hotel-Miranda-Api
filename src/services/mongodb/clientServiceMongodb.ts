
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientInterfaceMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'


export class ClientServiceMongodb implements ServiceInterfaceMongodb<ClientInterfaceMongodb> {

    async fetchAll(): Promise<ClientInterfaceMongodb[]> {
        try {
            const clients: ClientInterfaceMongodb[] = await ClientModelMongodb.find()
            return clients
        }
        catch (error) {
            console.error('Error in fetchAll of clientService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<ClientInterfaceMongodb | null> {
        try {
            const client: ClientInterfaceMongodb | null = await ClientModelMongodb.findById(id)
            if (client) return client
            else throw new Error('Client not found')
        }
        catch (error) {
            console.error('Error in fetchById of clientService', error)
            return null
        }
    }

    async create(client: ClientInterfaceMongodb): Promise<ClientInterfaceMongodb> {
        try {
            const newClient: ClientInterfaceMongodb = new ClientModelMongodb(client)
            await newClient.save()
            return newClient
        }
        catch (error) {
            console.error('Error in create of clientService', error)
            throw error
        }
    }

    async update(id: string, client: ClientInterfaceMongodb): Promise<ClientInterfaceMongodb | null> {
        try {
            const updatedClient: ClientInterfaceMongodb | null = await ClientModelMongodb.findOneAndUpdate(
                { _id: id },
                client,
                { new: true }
            )
            if (updatedClient) return updatedClient
            else return null
        }
        catch (error) {
            console.error('Error in update of clientService', error)
            throw error
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedClient = await ClientModelMongodb.findByIdAndDelete(id)
            if (deletedClient) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of clientService', error)
            throw error
        }
    }

}