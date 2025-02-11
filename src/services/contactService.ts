
import contactData from '../data/contactData.json'
import { ContactInterface } from '../interfaces/contactInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { checkFirstIDAvailable } from '../utils/utils'


export class ContactService implements ServiceInterface<ContactInterface> {

    private contacts: ContactInterface[] = contactData as ContactInterface[]

    fetchAll(): ContactInterface[] {
        return this.contacts
    }

    fetchById(id: number): ContactInterface | undefined {
        return this.contacts.find(contact => contact.id === id)
    }

    create(contact: ContactInterface): ContactInterface {
        const newContact = { ...contact, id: checkFirstIDAvailable(this.contacts.map(item => item.id)) }
        this.contacts.push(newContact)
        return newContact
    }

    update(contactIn: ContactInterface): ContactInterface | undefined {
        const contactToUpdate = this.contacts.find(contact => contact.id === contactIn.id)
        if (contactToUpdate) {
            const updatedContact = { ...contactToUpdate, ...contactIn }
            this.contacts = this.contacts.map(contact =>
                contact.id === contactIn.id ? updatedContact : contact
            )
            return updatedContact
        }
        else return undefined
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