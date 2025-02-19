
export interface ServiceInterface<T> {
    fetchAll(): Promise<T[]>
    fetchById(id: string): Promise<T | null>
    create(item: T): Promise<T | T[]>       // VOLVER A PONER A <T> AL ACABAR CON FAKER
    update(id: string, item: T): Promise<T | null>
    delete(id: string): Promise<boolean>
}