export interface ICrudService {
    model: object;
    getAll(params);
    getOne(params, id?);
    create(data);
    update(id, data);
}
