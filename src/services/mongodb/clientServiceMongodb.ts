
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ContactModelMongodb } from '../../models/mongodb/contactModelMongodb'
import { ClientInterfaceMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'


export class ContactServiceMongodb implements ServiceInterfaceMongodb<ClientInterfaceMongodb> {

    async fetchAll(): Promise<ClientInterfaceMongodb[]> {
        try {
            const contacts: ClientInterfaceMongodb[] = await ContactModelMongodb.find()
            return contacts
        }
        catch (error) {
            console.error('Error in fetchAll of contactService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<ClientInterfaceMongodb | null> {
        try {
            const contact: ClientInterfaceMongodb | null = await ContactModelMongodb.findById(id)
            if (contact) return contact
            else throw new Error('Contact not found')
        }
        catch (error) {
            console.error('Error in fetchById of contactService', error)
            return null
        }
    }

    async create(contact: ClientInterfaceMongodb): Promise<ClientInterfaceMongodb> {
        try {
            const newContact: ClientInterfaceMongodb = new ContactModelMongodb(contact)
            await newContact.save()
            return newContact
        }
        catch (error) {
            console.error('Error in create of contactService', error)
            throw error
        }
    }

    async update(id: string, contact: ClientInterfaceMongodb): Promise<ClientInterfaceMongodb | null> {
        try {
            const updatedContact: ClientInterfaceMongodb | null = await ContactModelMongodb.findOneAndUpdate(
                { _id: id },
                contact,
                { new: true }
            )
            if (updatedContact) return updatedContact
            else return null
        }
        catch (error) {
            console.error('Error in update of contactService', error)
            throw error
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedContact = await ContactModelMongodb.findByIdAndDelete(id)
            if (deletedContact) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of contactService', error)
            throw error
        }
    }

}