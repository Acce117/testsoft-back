export interface ICrudService {
    getAll(params);
    getOne(params, id?);
    create(data);
}
