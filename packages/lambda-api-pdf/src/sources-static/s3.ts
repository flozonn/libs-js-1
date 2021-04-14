import {s3 as awss3} from '@ohoareau/aws';
import {ctx} from '@ohoareau/lambda-utils';

export async function s3(ctx: ctx): Promise<any|undefined> {
    let {bucket: originalBucket, name} = ctx.query;
    const bucket = (ctx.config?.static_buckets || {})[originalBucket];
    if (!bucket) return undefined;
    const x = {bucket: originalBucket, key: name, ttl: 5 * 60 /* 5 min */ };
    if ('function' === typeof bucket) {
        const r = await bucket(ctx.query, ctx);
        if (!r) return undefined;
        Object.assign(x, r);
    }
    return {
        location: (await awss3.getFileViewUrl({...x, contentType: 'application/pdf'})).viewUrl,
    }
}

export default s3