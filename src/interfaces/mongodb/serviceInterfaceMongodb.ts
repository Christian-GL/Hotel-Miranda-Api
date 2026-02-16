
import { OptionYesNo } from "../../enums/optionYesNo"


// export interface ServiceInterfaceMongodb<T> {
//     fetchAll(): Promise<T[]>
//     fetchById(id: string): Promise<T | null>
//     create(item: T): Promise<T>
//     update(id: string, item: T): Promise<T | null>
//     delete(id: string): Promise<boolean>
// }

export interface ServiceInterfaceMongodb<
    TEntity,
    TCreateResponse = TEntity,
    TUpdateResponse = TEntity | null,
    TArchiveResponse = TEntity | null,
    TDeleteResponse = boolean
> {
    fetchAll(): Promise<TEntity[]>
    fetchById(id: string): Promise<TEntity | null>
    create(item: TEntity): Promise<TCreateResponse>
    update(id: string, item: TEntity): Promise<TUpdateResponse>
    archive(id: string, newArchivedValue: OptionYesNo): Promise<TArchiveResponse>
    delete(id: string): Promise<TDeleteResponse>
}