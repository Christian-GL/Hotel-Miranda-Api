
export interface ServiceInterface<T> {
    fetchAll(): Promise<T[]>
    fetchById(id: number): Promise<T | null>
    create(item: T): Promise<T | T[]>       // VOLVER A PONER A <T> AL ACABAR CON FAKER
    update(item: T): Promise<T | null>
    delete(id: number): Promise<boolean>
}