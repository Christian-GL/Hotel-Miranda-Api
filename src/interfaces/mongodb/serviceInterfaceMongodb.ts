
export interface ServiceInterfaceMongodb<T> {
    fetchAll(): Promise<T[]>
    fetchById(id: string): Promise<T | null>
    create(item: T): Promise<T>
    update(id: string, item: T): Promise<T | null>
    delete(id: string): Promise<boolean>
}