export interface ICrudService {
    model: any;
    getAll(params);
    getOne(params, id?);
    create(data);
    update(id, data);
    delete(id);
}
