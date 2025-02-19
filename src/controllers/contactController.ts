
import { Request, Response } from 'express'
import Router from 'express'
import { ContactService } from '../services/contactService'
import { ContactValidator } from '../validators/contactValidator'
import { authMiddleware } from '../middleware/authMiddleware'


export const contactRouter = Router()
const contactService = new ContactService()

contactRouter.use(authMiddleware)

/**
 * @swagger
 * /api-dashboard/v1/contacts:
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   publish_date:
 *                     type: string
 *                     format: date
 *                   publish_time:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   contact:
 *                     type: string
 *                   comment:
 *                     type: string
 */
contactRouter.get('/', async (req: Request, res: Response) => {
    const contactList = await contactService.fetchAll()
    res.json(contactList)
})

/**
 * @swagger
 * /api-dashboard/v1/contacts/{id}:
 *   get:
 *     summary: Obtener un contacto por ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 publish_date:
 *                   type: string
 *                   format: date
 *                 publish_time:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 contact:
 *                   type: string
 *                 comment:
 *                   type: string
 *       404:
 *         description: Contacto no encontrado
 */
contactRouter.get('/:id', async (req: Request, res: Response) => {
    const contact = await contactService.fetchById(parseInt(req.params.id))
    if (contact !== null) {
        res.json(contact)
    } else {
        res.status(404).json({ message: `Contact #${req.params.id} not found` })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/contacts:
 *   post:
 *     summary: Crear un nuevo contacto
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publish_date:
 *                 type: string
 *                 format: date
 *               publish_time:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 publish_date:
 *                   type: string
 *                   format: date
 *                 publish_time:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 contact:
 *                   type: string
 *                 comment:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 */
contactRouter.post('/', async (req: Request, res: Response) => {
    const contactValidator = new ContactValidator()
    const totalErrors = contactValidator.validateContact(req.body)
    if (totalErrors.length === 0) {
        const newContact = await contactService.create(req.body)
        res.status(201).json(newContact)
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/contacts:
 *   put:
 *     summary: Actualizar un contacto existente
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               publish_date:
 *                 type: string
 *                 format: date
 *               publish_time:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               contact:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       204:
 *         description: Contacto actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Contacto no encontrado
 */
contactRouter.put('/', async (req: Request, res: Response) => {
    const contactValidator = new ContactValidator()
    const updatedContact = await contactService.update(req.body)
    if (updatedContact !== null) {
        const totalErrors = contactValidator.validateContact(req.body)
        if (totalErrors.length === 0) {
            res.status(204).json(updatedContact)
        }
        else {
            res.status(400).json({ message: totalErrors.join(', ') })
        }
    }
    else {
        res.status(404).json({ message: `Contact #${req.body.id} not found` })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/contacts/{id}:
 *   delete:
 *     summary: Eliminar un contacto por ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del contacto
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contacto eliminado exitosamente
 *       404:
 *         description: Contacto no encontrado
 */
contactRouter.delete('/:id', async (req: Request, res: Response) => {
    const deletedContact = await contactService.delete(parseInt(req.params.id))
    if (deletedContact) {
        res.status(204).json()
    } else {
        res.status(404).json({ message: `Contact #${req.params.id} not found` })
    }
})