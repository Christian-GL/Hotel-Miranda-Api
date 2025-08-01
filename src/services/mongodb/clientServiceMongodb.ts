
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientInterfaceBaseMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'


export class ClientServiceMongodb implements ServiceInterfaceMongodb<ClientInterfaceBaseMongodb> {

    async fetchAll(): Promise<ClientInterfaceBaseMongodb[]> {
        try {
            const clients: ClientInterfaceBaseMongodb[] = await ClientModelMongodb.find()
            return clients
        }
        catch (error) {
            console.error('Error in fetchAll of clientService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<ClientInterfaceBaseMongodb | null> {
        try {
            const client: ClientInterfaceBaseMongodb | null = await ClientModelMongodb.findById(id)
            if (client) return client
            else throw new Error('Client not found')
        }
        catch (error) {
            console.error('Error in fetchById of clientService', error)
            return null
        }
    }

    async create(client: ClientInterfaceBaseMongodb): Promise<ClientInterfaceBaseMongodb> {
        try {
            const newClient: ClientInterfaceBaseMongodb = new ClientModelMongodb(client)
            await newClient.save()
            return newClient
        }
        catch (error) {
            console.error('Error in create of clientService', error)
            throw error
        }
    }

    async update(id: string, client: ClientInterfaceBaseMongodb): Promise<ClientInterfaceBaseMongodb | null> {
        try {
            const updatedClient: ClientInterfaceBaseMongodb | null = await ClientModelMongodb.findOneAndUpdate(
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