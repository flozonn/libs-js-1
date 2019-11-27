import {Executor, Config} from "..";

export default {
    pattern: 'get{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, fields } }) =>
        (await (<Executor>c.execute)('get', {id: event.params.id, fields: event.params.fields})).res.result
    ,
};