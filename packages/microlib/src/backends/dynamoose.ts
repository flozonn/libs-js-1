import dynamoose from '../services/dynamoose';

function mutateField(def) {
    const field: {[key: string]: any} = {type: String};
    switch (def.type) {
        case 'string':
            field.type = String;
            break;
        case 'number':
            field.type = Number;
            break;
        case 'boolean':
            field.type = Boolean;
            break;
        default:
            if (Array.isArray(def.type)) {
                field.type = 'list';
                field.list = def.type.map(l => mutateField(l));
            } else if ('object' === typeof def.type) {
                field.type = 'map';
                field.map = Object.entries(def.type).reduce((acc, [k, v]) => {
                    acc[k] = mutateField(v);
                    return acc;
                }, {});
            }
            break;
    }
    if (def.hasOwnProperty('default')) field.default = def.default;
    if (def.primaryKey) field.hashKey = true;
    if (def.index && (def.index.length > 0)) {
        field.index = def.index.map(i => ({global: true, name: i.name, ...(i.rangeKey ? {rangeKey: i.rangeKey} : {}), throughput: {read: 1, write: 1}, project: true}));
    }
    return def.list ? [field] : field;
}

export default model => dynamoose.getDb(
    Object.entries(model.fields || {}).reduce((acc, [k, def]: [string, any]) => {
        if (def.volatile) return acc;
        acc.schema[k] = mutateField(def);
        if (model.requiredFields && model.requiredFields[k]) acc.schema[k].required = true;
        return acc;
    }, {name: model.name, schema: {}, schemaOptions: {}, options: {create: false, update: false, waitForActive: false}})
)