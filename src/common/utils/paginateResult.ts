export function paginateResult(params, data) {
    let limit = parseInt(params.limit) || data.length;
    const offset = parseInt(params.offset) || 0;

    if (offset + limit > data.length) limit = data.length % limit;

    return {
        pages: Math.ceil(data.length / limit),
        elements_amount: data.length,
        data: data.slice(offset, offset + limit),
    };
}
