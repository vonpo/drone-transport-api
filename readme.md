**This is FAKE drone api.**

Prerequisite
`npm install serverless -g`

If you would like to use offline dynamo-db you can use docker image
https://github.com/dwmkerr/docker-dynamodb

For adding table to do you can use:
`var params = {
    TableName: 'drones-api-dev',
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput:  {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err);
    else ppJson(data);
});`


How to run api ?
`npm install`
`serverless offlne start`

