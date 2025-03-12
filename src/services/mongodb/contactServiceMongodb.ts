
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { ContactModelMongodb } from '../../models/mongodb/contactModelMongodb'
import { ContactInterfaceMongodb } from '../../interfaces/mongodb/contactInterfaceMongodb'


export class ContactServiceMongodb implements ServiceInterfaceMongodb<ContactInterfaceMongodb> {

    async fetchAll(): Promise<ContactInterfaceMongodb[]> {
        try {
            const contacts: ContactInterfaceMongodb[] = await ContactModelMongodb.find()
            return contacts
        }
        catch (error) {
            console.error('Error in fetchAll of contactService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<ContactInterfaceMongodb | null> {
        try {
            const contact: ContactInterfaceMongodb | null = await ContactModelMongodb.findById(id)
            if (contact) return contact
            else throw new Error('Contact not found')
        }
        catch (error) {
            console.error('Error in fetchById of contactService', error)
            return null
        }
    }

    async create(contact: ContactInterfaceMongodb): Promise<ContactInterfaceMongodb> {
        try {
            const newContact: ContactInterfaceMongodb = new ContactModelMongodb(contact)
            await newContact.save()
            return newContact
        }
        catch (error) {
            console.error('Error in create of contactService', error)
            throw error
        }
    }

    async update(id: string, contact: ContactInterfaceMongodb): Promise<ContactInterfaceMongodb | null> {
        try {
            const updatedContact: ContactInterfaceMongodb | null = await ContactModelMongodb.findOneAndUpdate(
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