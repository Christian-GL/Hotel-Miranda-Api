

import { validateString, validateOptionYesNo } from './validators'
import { OptionYesNo } from '../enums/optionYesNo'


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