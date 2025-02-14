
export interface ServiceInterface<T> {
    fetchAll(): T[]
    fetchById(id: number): T | null
    create(item: T): T
    update(item: T): T | null
    delete(id: number): boolean
}