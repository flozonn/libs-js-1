import {TypedMap} from "../..";

export default (config: TypedMap) => async (operation: string, payload: any) => {
    switch (operation) {
        case 'find':
            return {items: Object.values(config.data)};
        case 'get':
            return config.data[payload.id];
        case 'delete':
            const r = config.data[payload.id];
            delete config.data[payload.id];
            return r;
        case 'create':
            console.log(payload);
            config.data[payload.data.id] = payload.data;
            return config.data[payload.data.id];
        case 'update':
            config.data[payload.id] = {...config.data[payload.id], ...payload.data};
            return config.data[payload.id];
        default:
            return undefined;
    }
}