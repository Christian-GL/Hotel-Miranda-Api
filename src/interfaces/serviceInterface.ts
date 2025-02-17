
export interface ServiceInterface<T> {
    fetchAll(): Promise<T[]>
    fetchById(id: number): Promise<T | null>
    create(item: T): Promise<T>
    update(item: T): Promise<T | null>
    delete(id: number): Promise<boolean>
}