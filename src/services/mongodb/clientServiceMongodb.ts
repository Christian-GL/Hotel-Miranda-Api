
import mongoose, { ClientSession } from 'mongoose'

import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientInterface, ClientInterfaceIdMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import { BookingInterfaceIdMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingServiceMongodb } from './bookingServiceMongodb'
import { ClientArchiveResponseInterface } from '../../interfaces/mongodb/response/client/clientArchiveResponseInterface'
import { ClientDeleteResponseInterface } from '../../interfaces/mongodb/response/client/clientDeleteResponseInterface'


export class ClientServiceMongodb implements ServiceInterfaceMongodb<
    ClientInterface,
    ClientInterfaceIdMongodb,
    ClientInterfaceIdMongodb | null,
    // ClientArchiveResponseInterface,  // !!! DESCOMENTAR
    ClientDeleteResponseInterface
> {

    async fetchAll(): Promise<ClientInterfaceIdMongodb[]> {
        try {
            const clients: ClientInterfaceIdMongodb[] = await ClientModelMongodb.find()
            return clients
        }
        catch (error) {
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
            return null
        }
    }

    async create(client: ClientInterface): Promise<ClientInterfaceIdMongodb> {
        try {
            const newClient: ClientInterfaceIdMongodb = new ClientModelMongodb(client)
            await newClient.save()
            return newClient
        }
        catch (error) {
            throw error
        }
    }

    async update(clientId: string, clientToUpdate: ClientInterface): Promise<ClientInterfaceIdMongodb | null> {
        try {
            const updatedClient = await ClientModelMongodb.findOneAndUpdate(
                { _id: clientId },
                { $set: clientToUpdate },
                { new: true, runValidators: true, context: 'query' }
            ).lean() as ClientInterfaceIdMongodb | null

            return updatedClient
        }
        catch (error) {
            throw error
        }
    }

    async updateArchiveState(id: string, isArchived: OptionYesNo, session?: ClientSession): Promise<ClientInterfaceIdMongodb | null> {
        try {
            const updatedClient = await ClientModelMongodb.findByIdAndUpdate(
                id,
                { $set: { isArchived: isArchived } },
                { new: true, session }
            )

            return updatedClient
        }
        catch (error) {
            throw error
        }
    }

    async archive(id: string, isArchived: OptionYesNo): Promise<ClientArchiveResponseInterface | null> {
        try {
            const bookingServiceMongodb = new BookingServiceMongodb()
            const updatedClient = await this.updateArchiveState(id, isArchived)
            if (!updatedClient) return null

            let updatedBookings: BookingInterfaceIdMongodb[] = []
            // Si se está archivando:
            if (isArchived === OptionYesNo.yes && updatedClient.booking_id_list?.length) {
                const bookingPromises = updatedClient.booking_id_list.map(bookingId =>
                    bookingServiceMongodb.updateArchiveState(
                        bookingId.toString(),
                        OptionYesNo.yes
                    )
                )
                updatedBookings = (await Promise.all(bookingPromises)).filter(Boolean) as BookingInterfaceIdMongodb[]
            }

            return {
                clientUpdated: updatedClient,
                updatedBookings
            }
        }
        catch (error) {
            throw error
        }
    }

    async delete(id: string): Promise<ClientDeleteResponseInterface> {
        // Elimina el cliente y si es necesario archiva las bookings asociadas.
        const session = await mongoose.startSession()
        let updatedBookings: BookingInterfaceIdMongodb[] = []

        try {
            await session.withTransaction(async () => {

                const client = await ClientModelMongodb
                    .findById(id)
                    .session(session)
                    .lean() as ClientInterfaceIdMongodb | null

                if (!client) {
                    throw new Error(`Client #${id} not found`)
                }

                const bookingIds: string[] = Array.isArray((client as any).booking_id_list)
                    ? Array.from(
                        new Set(
                            (client as any).booking_id_list.map((x: any) =>
                                String(x).trim()
                            )
                        )
                    )
                    : []

                if (bookingIds.length > 0) {
                    await BookingModelMongodb.updateMany(
                        {
                            _id: { $in: bookingIds },
                            isArchived: OptionYesNo.no
                        },
                        {
                            $set: { isArchived: OptionYesNo.yes }
                        },
                        { session }
                    ).exec()

                    updatedBookings = await BookingModelMongodb.find(
                        { _id: { $in: bookingIds } }
                    )
                        .session(session)
                        .lean() as BookingInterfaceIdMongodb[]
                }

                const deletedClient = await ClientModelMongodb
                    .findOneAndDelete({ _id: id }, { session })
                    .exec()

                if (!deletedClient) {
                    // Condición de carrera → rollback
                    throw new Error(`Client #${id} not found during delete`)
                }
            })

            return {
                clientIsDeleted: true,
                clientId: id,
                updatedBookings
            }
        }
        catch (error) {
            throw error
        }
        finally {
            session.endSession()
        }
    }



    /* === MÉTODOS PARA USO EN OTROS SERVICES === */

    // Hacer $pull de booking ids (participa en transacción)
    async removeBookingIdsFromClient(clientId: string, bookingIds: string[], session?: ClientSession): Promise<void> {
        await ClientModelMongodb
            .updateOne(
                { _id: clientId },
                { $pull: { booking_id_list: { $in: bookingIds } } },
                { session }
            ).exec()
    }

    // Recuperar muchos clientes (con session opcional)
    async fetchByIds(ids: string[], session?: ClientSession | null): Promise<ClientInterfaceIdMongodb[]> {
        return await ClientModelMongodb
            .find({ _id: { $in: ids } })
            .session(session ?? null)
            .lean() as ClientInterfaceIdMongodb[]
    }

}