const cosmos = require('@azure/cosmos');
require('dotenv').config({ path: __dirname + '/.env' });

const endpoint = process.env.DB_END_POINT;
const masterKey = process.env.DB_KEY;
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint: endpoint, key: masterKey });
// All function invocations also reference the same database and container.
const container = client.database("IoTEvents").container("events");

module.exports = async function (context) {
    var hourago = new Date(new Date().getTime() - (1000 * 60 * 60)).getTime() / 1000;

    const querySpec = {
        query: `SELECT c.temperature, c.humidity FROM c WHERE c._ts > ${hourago}`
    };
    context.log("querySpec", querySpec);
    const options = {
        enableCrossPartitionQuery: true
    };
    // context.log("container", container.items);

    const { resources: results } = await container.items.query(querySpec).fetchAll();


    // const { result: results } = await container.items.query(querySpec).fetchAll();
    // context.log("results", results);
    context.res = {
        body: JSON.stringify(results),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    context.done();
}