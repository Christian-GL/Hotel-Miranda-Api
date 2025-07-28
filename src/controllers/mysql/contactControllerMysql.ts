
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { ContactServiceMysql } from '../../services/mysql/contactServiceMysql'
// import { ContactValidator } from '../../validators/contactValidator'


export const contactRouterMysql = Router()
const contactServiceMysql = new ContactServiceMysql()

contactRouterMysql.use(authMiddleware)


/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         publish_date:
 *           type: string
 *           format: date-time
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone_number:
 *           type: string
 *         comment:
 *           type: string
 *         archived:
 *           type: boolean
 * 
 * /api-dashboard/v3/contacts:
 *   get:
 *     summary: Obtener todos los contactos
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Lista de contactos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 * 
 *   post:
 *     summary: Crear un nuevo contacto
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *
 * /api-dashboard/v3/contacts/{id}:
 *   get:
 *     summary: Obtener un contacto por su ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contacto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contacto no encontrado
 *
 *   put:
 *     summary: Actualizar un contacto existente
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contacto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Contacto no encontrado
 * 
 *   delete:
 *     summary: Eliminar un contacto por su ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contacto eliminado exitosamente
 *       404:
 *         description: Contacto no encontrado
 */

/* !!!
 Parte del código relacionada con "Contact" comentada debido a
que en la V3 de la API ahora es "client" y se actualizó para MongoDB
*/

contactRouterMysql.get('/', async (req: Request, res: Response) => {
    try {
        const contactList = await contactServiceMysql.fetchAll()
        res.json(contactList)
    }
    catch (error) {
        console.error("Error in get (all) of contactController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

contactRouterMysql.get('/:id', async (req: Request, res: Response) => {
    try {
        const contact = await contactServiceMysql.fetchById(parseInt(req.params.id))
        if (contact !== null) {
            res.json(contact)
        } else {
            res.status(404).json({ message: `Contact #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of contactController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

contactRouterMysql.post('/', async (req: Request, res: Response) => {
    // const contactValidator = new ContactValidator()
    // const totalErrors = contactValidator.validateContact(req.body)
    // if (totalErrors.length === 0) {
    try {
        const newContact = await contactServiceMysql.create(req.body)
        res.status(201).json(newContact)
    }
    catch (error) {
        console.error("Error in post of contactController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
    // }
    // else {
    //     res.status(400).json({
    //         message: totalErrors.join(', ')
    //     })
    // }
})

contactRouterMysql.put('/:id', async (req: Request, res: Response) => {
    // const contactValidator = new ContactValidator()
    // const totalErrors = contactValidator.validateContact(req.body)

    // if (totalErrors.length === 0) {
    try {
        const updatedContact = await contactServiceMysql.update(parseInt(req.params.id), req.body)
        if (updatedContact !== null) {
            res.status(200).json(updatedContact)
        }
        else {
            res.status(404).json({ message: `Contact #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in put of contactController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
    // }
    // else {
    //     res.status(400).json({ message: totalErrors.join(', ') })
    // }
})

contactRouterMysql.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedContact = await contactServiceMysql.delete(parseInt(req.params.id))
        if (deletedContact) {
            res.status(204).json()
        } else {
            res.status(404).json({ message: `Contact #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in delete of contactController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})