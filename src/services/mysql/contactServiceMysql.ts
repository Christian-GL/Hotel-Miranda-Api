
import { ServiceInterfaceMysql } from '../../interfaces/mysql/serviceInterfaceMysql'
import { ContactModelMysql } from '../../models/mysql/contactModelMysql'
import { ContactInterfaceMysql } from '../../interfaces/mysql/contactInterfaceMysql'


export class ContactServiceMysql implements ServiceInterfaceMysql<ContactInterfaceMysql> {

    async fetchAll(): Promise<ContactInterfaceMysql[]> {
        try {
            const contacts: ContactInterfaceMysql[] = await ContactModelMysql.findAll()
            // console.log('==> ', contacts)
            // const contactsToReturn: ContactInterfaceMysql[] = contacts.map(contact => ({
            //     ...contact,
            //     _id: contact._id.toString(),
            //     archived: contact.archived === 1
            // }));
            return contacts
        }
        catch (error) {
            console.error('Error in fetchAll of contactService', error)
            throw error
        }
    }

    async fetchById(id: number): Promise<ContactInterfaceMysql | null> {
        try {
            const contact: ContactInterfaceMysql | null = await ContactModelMysql.findByPk(id)
            if (contact) return contact
            else throw new Error('Contact not found')
        }
        catch (error) {
            console.error('Error in fetchById of contactService', error)
            return null
        }
    }

    async create(contact: ContactInterfaceMysql): Promise<ContactInterfaceMysql> {
        try {
            // contact.archived ? contact.archived = 'true' : contact.archived = 'false'
            const newContact: ContactInterfaceMysql = await ContactModelMysql.create(contact)
            return newContact
        }
        catch (error) {
            console.error('Error in create of contactService', error)
            throw error
        }
    }

    async update(id: number, contact: ContactInterfaceMysql): Promise<ContactInterfaceMysql | null> {
        try {
            const [updatedContact] = await ContactModelMysql.update(contact, { where: { _id: id } })
            if (updatedContact === 0) return null

            return await this.fetchById(id)
        }
        catch (error) {
            console.error('Error in update of contactService', error)
            throw error
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedContact = await ContactModelMysql.destroy({ where: { _id: id } })

            if (deletedContact) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of contactService', error)
            throw error
        }
    }

}