
import { OptionYesNo } from "../../enums/optionYesNo"


// export interface ServiceInterfaceMongodb<T> {
//     fetchAll(): Promise<T[]>
//     fetchById(id: string): Promise<T | null>
//     create(item: T): Promise<T>
//     update(id: string, item: T): Promise<T | null>
//     delete(id: string): Promise<boolean>
// }

export interface ServiceInterfaceMongodb<
    T,
    TCreateResponse = T,
    TUpdateResponse = T | null,
    // TArchiveResponse = T | null,
    TDeleteResponse = boolean
> {
    fetchAll(): Promise<T[]>
    fetchById(id: string): Promise<T | null>
    create(item: T): Promise<TCreateResponse>
    update(id: string, item: T): Promise<TUpdateResponse>
    updateArchiveState(id: string, isArchived: OptionYesNo): Promise<T | null>
    // archive(id: string, isArchived: OptionYesNo): Promise<TArchiveResponse | null>
    delete(id: string): Promise<TDeleteResponse>
}