
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
    TDeleteResponse = boolean
> {
    fetchAll(): Promise<TEntity[]>
    fetchById(id: string): Promise<TEntity | null>
    create(item: TEntity): Promise<TCreateResponse>
    update(id: string, item: TEntity): Promise<TUpdateResponse>
    delete(id: string): Promise<TDeleteResponse>
}