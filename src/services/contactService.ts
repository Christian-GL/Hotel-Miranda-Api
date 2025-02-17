
import { ContactModel } from '../models/contactModel'
import { ContactInterface } from '../interfaces/contactInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'


export class ContactService implements ServiceInterface<ContactInterface> {

    async fetchAll(): Promise<ContactInterface[]> {
        try {
            const contacts: ContactInterface[] = await ContactModel.find()
            return contacts
        }
        catch (error) {
            console.error('Error in fetchAll of contactService', error)
            throw error
        }
    }

    async fetchById(id: number): Promise<ContactInterface | null> {
        try {
            const contact: ContactInterface | null = await ContactModel.findById(id)
            if (contact) return contact
            else throw new Error('Contact not found')
        }
        catch (error) {
            console.error('Error in fetchById of contactService', error)
            throw error
        }
    }

    async create(contact: ContactInterface): Promise<ContactInterface> {
        try {
            const newContact: ContactInterface = new ContactModel(contact)
            await newContact.save()
            return newContact
        }
        catch (error) {
            console.error('Error in create of contactService', error)
            throw error
        }
    }

    async update(contact: ContactInterface): Promise<ContactInterface | null> {
        try {
            const updatedContact: ContactInterface | null = await ContactModel.findOneAndUpdate(
                { _id: contact.id },
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

    async delete(id: number): Promise<boolean> {
        try {
            const deletedContact = await ContactModel.findByIdAndDelete(id)
            if (deletedContact) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of contactService', error)
            throw error
        }
    }

}