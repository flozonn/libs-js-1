const db = require('./dynamoose').getDb({
    name: 'migration',
    schema: {
        id: {type: String, hashKey: true, required: true},
    },
    schemaOptions: {
        timestamps: true,
    },
    options: {
        create: false, update: false, waitForActive: false,
    },
});

const applyMigrate = async () => ({}); // @todo implement

const createLogger = ({add, remove}) => async (event, data) => {
    switch (event) {
        case 'migrationLog':
            console.log(`[migration-${data.action}(${data.name})]`, ...data.args);
            break;
        case 'migrationLogError':
            console.error(`[migration-${data.action}(${data.name})]`, ...data.args);
            break;
        case 'migrationSucceed':
            switch (data.action) {
                case 'up':
                    await add(data);
                    console.log(`Migration '${data.name}' succeed (up), add to db`);
                    break;
                case 'down':
                    await remove(data);
                    console.log(`Migration '${data.name}' succeed (down), removed from db`);
                    break;
            }
            break;
        case 'migrationFailed':
            console.log(`Migration '${data.name}' failed with message: ${data.error.message}`, data.error);
            break;
        case 'migrateStarting':
            console.log(`Starting migration process with ${data.planned.length} migrations selected [${data.planned.join(', ')}]`);
            break;
        case 'migrateSkipped':
            console.log(`No migrations to deploy, skipping.`);
            break;
        case 'migrateCompleted':
            console.log(`Completed migration process with ${data.planned.length} migrations selected and ${data.deployed.length} migrations deployed [${data.deployed.join(', ')}]`);
            break;
        case 'migrateFailed':
            console.log(`Failed migration process with ${data.planned.length} migrations selected and ${data.deployed.length} migrations deployed [${data.deployed.join(', ')}] and ${data.failed.length} migrations failed [${data.failed.join(', ')}]`);
            break;
        default:
            break;
    }
};

const migration = '...'; // @todo pick up migration info
const migrate = async () => {
    /*
    return applyMigrate(
        migration,
        (await db.find({})).items.map(i => i.id),
        {},
        'up',
        createLogger({
            add: async migration => db.create({data: {id: migration.name}}),
            remove: async migration => db.delete({id: migration.name}),
        })
    );
     */
    return {};
};
module.exports = {
    migrate,
};