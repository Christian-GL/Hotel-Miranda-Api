
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientInterfaceDTO, ClientInterfaceIdMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'


export class ClientServiceMongodb implements ServiceInterfaceMongodb<ClientInterfaceIdMongodb> {

    async fetchAll(): Promise<ClientInterfaceIdMongodb[]> {
        try {
            const clients: ClientInterfaceIdMongodb[] = await ClientModelMongodb.find()
            return clients
        }
        catch (error) {
            console.error('Error in fetchAll of clientService', error)
            throw error
        }
    }

    async fetchAllNotArchived(): Promise<ClientInterfaceIdMongodb[]> {
        try {
            const clients = await ClientModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { _id: 1 }
            ).lean()
            return clients
        }
        catch (error) {
            console.error('Error in fetchAllNotArchived of clientService', error)
            throw error
        }
    }

    async fetchAllIdsNotArchived(): Promise<string[]> {
        try {
            const clientIds = await ClientModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { _id: 1 }
            ).lean()
            return clientIds.map((client: any) => String(client._id))
        }
        catch (error) {
            console.error('Error in fetchAllIdsNotArchived of roomService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<ClientInterfaceIdMongodb | null> {
        try {
            const client: ClientInterfaceIdMongodb | null = await ClientModelMongodb.findById(id)
            if (client) return client
            else throw new Error('Client not found')
        }
        catch (error) {
            console.error('Error in fetchById of clientService', error)
            return null
        }
    }

    async create(client: ClientInterfaceDTO): Promise<ClientInterfaceIdMongodb> {
        try {
            const newClient: ClientInterfaceIdMongodb = new ClientModelMongodb(client)
            await newClient.save()
            return newClient
        }
        catch (error) {
            console.error('Error in create of clientService', error)
            throw error
        }
    }

    async update(id: string, client: ClientInterfaceDTO): Promise<ClientInterfaceIdMongodb | null> {
        try {
            const updatedClient: ClientInterfaceIdMongodb | null = await ClientModelMongodb.findOneAndUpdate(
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

    async deleteAndArchiveBookings(id: string): Promise<boolean> {
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