export interface IBaseService<T> {
  create(data: any): Promise<T>
  findAll(): Promise<T[]>
  findById(id: string): Promise<T | null>
  update(id: string, data: Partial<T>): Promise<T | null>
  delete(id: string): Promise<void>
}
