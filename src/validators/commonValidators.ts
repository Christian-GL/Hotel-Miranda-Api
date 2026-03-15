

import { OptionYesNo } from 'enums/optionYesNo'
import { validateOptionYesNo, validateString } from 'validators/validators'


export class CommonValidators {

    validateArchivedOption(option: OptionYesNo): string[] {
        const allErrorMessages: string[] = []

        validateString(option, 'isArchived').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(option, 'User isArchived').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}