
import contactData from '../data/contactData.json'
import { ContactInterface } from '../interfaces/contactInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { checkFirstIDAvailable } from '../utils/dateUtils'


export class ContactService implements ServiceInterface<ContactInterface> {

    private contacts: ContactInterface[] = contactData as ContactInterface[]

    fetchAll(): ContactInterface[] {
        return this.contacts
    }

    fetchById(id: number): ContactInterface | null {
        const contact = this.contacts.find(contact => contact.id === id)
        return contact === undefined ? null : contact
    }

    create(contact: ContactInterface): ContactInterface {
        const newContact = { ...contact, id: checkFirstIDAvailable(this.contacts.map(item => item.id)) }
        this.contacts.push(newContact)
        return newContact
    }

    update(contactIn: ContactInterface): ContactInterface | null {
        const contactToUpdate = this.contacts.find(contact => contact.id === contactIn.id)
        if (contactToUpdate) {
            const updatedContact = { ...contactToUpdate, ...contactIn }
            this.contacts = this.contacts.map(contact =>
                contact.id === contactIn.id ? updatedContact : contact
            )
            return updatedContact
        }
        else return null
    }

    delete(id: number): boolean {
        const contactToDelete = this.contacts.find(contact => contact.id === id)
        if (contactToDelete) {
            this.contacts = this.contacts.filter(contact => contact.id !== id)
            return true
        }
        return false
    }

}