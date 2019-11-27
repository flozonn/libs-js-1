import AWS from 'aws-sdk';
import {Map, TypedMap, Handler, Config} from "../..";

const sqs = new AWS.SQS();

export default (ec: TypedMap, c: Config) => async (event: any, context: any): Promise<any> => {
    if (!event.Records || !event.Records.length) return;
    await Promise.all(event.Records.map(async r => {
        const receiptHandle = r.receiptHandle;
        const body = JSON.parse(r.body);
        const eventType = body.MessageAttributes.fullType.Value.toLowerCase().replace(/\./g, '_');
        const splits = r.eventSourceARN.split(':');
        const queueUrl = sqs.endpoint.href + splits[4] + '/' + splits[5];
        if (c.eventListeners && c.eventListeners[eventType]) {
            const attributes = Object.entries(body.MessageAttributes).reduce((acc, [k, m]) => {
                acc[k] = (<Map>m).Value;
                return acc;
            }, {});
            await (<Handler>c.eventListeners[eventType])(
                JSON.parse(body.Message),
                {
                    attributes,
                    execute: c.execute,
                    config: c,
                    context,
                    queueUrl,
                    receiptHandle,
                }
            );
        }
        sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle});
    }));
}