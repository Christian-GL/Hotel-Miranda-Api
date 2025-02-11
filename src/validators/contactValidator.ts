
import { ContactInterface } from "../interfaces/contactInterface"
import { dateFormatToYYYYMMDD } from "../utils/utils"
import { hourFormatTo24H } from "../utils/utils"


export class ContactValidator {

    validateProperties(contact: ContactInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['publish_date', 'publish_time', 'full_name', 'email', 'contact', 'comment']
        requiredProperties.map((property) => {
            if (!(property in contact)) {
                errorMessages.push(`Property [${property}] is required in Contact`)
            }
        })
        return errorMessages
    }

    validateContact(contact: ContactInterface): string[] {
        const allErrorMessages: string[] = []

        const checkProperties = this.validateProperties(contact)
        if (checkProperties.length > 0) {
            return checkProperties
        }

        this.validatePublishDate(contact.publish_date).map(
            error => allErrorMessages.push(error)
        )
        this.validatePublishTime(contact.publish_time).map(
            error => allErrorMessages.push(error)
        )
        this.validateFullName(contact.full_name).map(
            error => allErrorMessages.push(error)
        )
        this.validateEmail(contact.email).map(
            error => allErrorMessages.push(error)
        )
        this.validatePhoneNumber(contact.contact).map(
            error => allErrorMessages.push(error)
        )
        this.validateComment(contact.comment).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validatePublishDate(publishDate: string): string[] {
        const errorMessages: string[] = []

        const publishDateFormatted = dateFormatToYYYYMMDD(publishDate)
        const publishDateTypeDate = new Date(publishDateFormatted)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        publishDateTypeDate.setHours(0, 0, 0, 0)

        if (isNaN(publishDateTypeDate.getTime())) {
            errorMessages.push('Publish date is not a valid date')
        }
        if (publishDateTypeDate > currentDate) {
            errorMessages.push('Publish date cant be afer today')
        }
        return errorMessages
    }
    validatePublishTime(publishTime: string): string[] {
        const errorMessages: string[] = []

        const publishTimeFormatted = hourFormatTo24H(publishTime)
        const publishTimeParts = publishTimeFormatted.split(':')
        const hours = parseInt(publishTimeParts[0])
        const minutes = parseInt(publishTimeParts[1])

        if (isNaN(hours) || isNaN(minutes)) {
            errorMessages.push('Publish time is not a valid time')
        }
        if (hours < 0 || hours > 23) {
            errorMessages.push('Publish time hours is not a valid number (<0 or >23)')
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Publish time minutes is not a valid number (<0 or >59)')
        }

        return errorMessages
    }
    validateFullName(fullName: string): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^[^\d]*$/)

        if (typeof fullName !== "string") {
            errorMessages.push('Name is not a String')
        }
        if (fullName.length < 3) {
            errorMessages.push('Name length must be 3 characters or more')
        }
        if (fullName.length > 50) {
            errorMessages.push('Name length must be 50 characters or less')
        }
        if (!regex.test(fullName)) {
            errorMessages.push('Name must not contain numbers')
        }

        return errorMessages
    }
    validateEmail(email: string): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        if (typeof email !== "string") {
            errorMessages.push('Email is not a String')
        }
        if (!regex.test(email)) {
            errorMessages.push('Email format no valid')
        }

        return errorMessages
    }
    validatePhoneNumber(phoneNumber: string): string[] {
        const errorMessages: string[] = []
        const regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/

        if (typeof phoneNumber !== "string") {
            errorMessages.push('Phone number is not a String')
        }
        if (phoneNumber.length < 9) {
            errorMessages.push('Phone number length must be 9 characters or more')
        }
        if (phoneNumber.length > 20) {
            errorMessages.push('Phone number length must be 20 characters or less')
        }
        if (!regex.test(phoneNumber)) {
            errorMessages.push('Phone number only digits are available')
        }

        return errorMessages
    }
    validateComment(comment: string): string[] {
        const errorMessages: string[] = []

        if (typeof comment !== "string") {
            errorMessages.push('Text is not a String')
        }
        if (comment.length < 10) {
            errorMessages.push('Text length must be 10 characters or more')
        }
        if (comment.length > 500) {
            errorMessages.push('Text length must be 500 characters or less')
        }

        return errorMessages
    }

}