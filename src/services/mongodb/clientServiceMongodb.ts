
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientInterface, ClientInterfaceIdMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import mongoose from 'mongoose'
import { BookingInterfaceIdMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingServiceMongodb } from './bookingServiceMongodb'
import { ClientUpdateResponseInterface } from '../../interfaces/mongodb/response/client/clientUpdateResponseInterface'
import { ClientArchiveResponseInterface } from '../../interfaces/mongodb/response/client/clientArchiveResponseInterface'
import { ClientDeleteResponseInterface } from '../../interfaces/mongodb/response/client/clientDeleteResponseInterface'


export class ClientServiceMongodb implements ServiceInterfaceMongodb<
    ClientInterface,
    ClientInterfaceIdMongodb,
    ClientUpdateResponseInterface,
    ClientInterfaceIdMongodb | null,    // !!! <--
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

    // async update(clientId: string, clientToUpdate: ClientInterface): Promise<ClientUpdateResponseInterface> {
    //     // Actualiza el cliente y si es necesario archiva las bookings asociadas.
    //     const session = await mongoose.startSession()
    //     let updatedBookings: BookingInterfaceIdMongodb[] = []

    //     try {
    //         await session.withTransaction(async () => {

    //             // Si se va a desarchivar un cliente, vacia su "booking_id_list" (ya que las bookings asociadas siguen archivadas)
    //             const oldClient = await ClientModelMongodb
    //                 .findById(clientId)
    //                 .session(session)
    //                 .lean() as ClientInterfaceIdMongodb | null

    //             if (!oldClient) {
    //                 throw new Error(`Client #${clientId} not found`)
    //             }
    //             if (
    //                 oldClient.isArchived === OptionYesNo.yes &&
    //                 clientToUpdate.isArchived === OptionYesNo.no
    //             ) {
    //                 clientToUpdate.booking_id_list = []
    //             }
    //             const updatedClient = await ClientModelMongodb.findOneAndUpdate(
    //                 { _id: clientId },
    //                 clientToUpdate,
    //                 { new: true, session }
    //             ).exec()

    //             if (!updatedClient) {
    //                 throw new Error(`Client #${clientId} not found`)
    //             }

    //             // Si el client se archiva, archivar sus bookings
    //             if (
    //                 clientToUpdate.isArchived === OptionYesNo.yes &&
    //                 clientToUpdate.booking_id_list &&
    //                 clientToUpdate.booking_id_list.length > 0
    //             ) {
    //                 await BookingModelMongodb.updateMany(
    //                     {
    //                         _id: { $in: clientToUpdate.booking_id_list },
    //                         isArchived: OptionYesNo.no
    //                     },
    //                     { $set: { isArchived: OptionYesNo.yes } },
    //                     { session }
    //                 ).exec()

    //                 updatedBookings = await BookingModelMongodb.find(
    //                     { _id: { $in: clientToUpdate.booking_id_list } }
    //                 )
    //                     .session(session)
    //                     .lean() as BookingInterfaceIdMongodb[]
    //             }
    //         })
    //         const finalClientFresh = await ClientModelMongodb.findById(clientId).lean()
    //         return {
    //             clientUpdated: finalClientFresh as ClientInterfaceIdMongodb,
    //             updatedBookings
    //         }
    //     }
    //     catch (error) {
    //         throw error
    //     }
    //     finally {
    //         session.endSession()
    //     }
    // }

    async update(clientId: string, clientToUpdate: ClientInterface): Promise<ClientUpdateResponseInterface> {
        try {
            const updatedClient = await ClientModelMongodb.findOneAndUpdate(
                { _id: clientId },
                { $set: clientToUpdate },
                { new: true, runValidators: true, context: 'query' }
            ).lean() as ClientInterfaceIdMongodb | null

            return {
                clientUpdated: updatedClient as ClientInterfaceIdMongodb,
                updatedBookings: []
            }
        }
        catch (error) {
            throw error
        }
    }

    async setArchiveStatus(id: string, isArchived: OptionYesNo): Promise<ClientInterfaceIdMongodb | null> {
        try {
            const updatedClient = await ClientModelMongodb.findByIdAndUpdate(
                id,
                { $set: { isArchived: isArchived } },
                { new: true }
            )
            if (updatedClient === null) { return null }

            return updatedClient
        }
        catch (error) {
            throw error
        }
    }

    async archive(id: string, isArchived: OptionYesNo): Promise<ClientArchiveResponseInterface | null> {
        try {
            const bookingServiceMongodb = new BookingServiceMongodb()
            const updatedClient = await this.setArchiveStatus(id, isArchived)
            if (!updatedClient) return null

            let updatedBookings: BookingInterfaceIdMongodb[] = []
            // Si se está archivando:
            if (isArchived === OptionYesNo.yes && updatedClient.booking_id_list?.length) {
                const bookingPromises = updatedClient.booking_id_list.map(bookingId =>
                    bookingServiceMongodb.setArchiveStatus(
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

}