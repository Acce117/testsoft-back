import { TreeRepository } from "typeorm";

export interface ICrudService {
    model: any;
    getAll(params);
    getOne(params, id?);
    create(data, manager?);
    update(id, data, manager?);
    delete(id, manager?);
    getPaginationData(limit?);
}

export interface ICrudTreeService extends ICrudService {
    treeRepository: TreeRepository<any>;
    getAncestors(params, id?);
}
