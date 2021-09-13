const express = require('express');
const next = require('next');

const { graphqlHTTP } = require('express-graphql');
const schema = require('./Schemas');

const port = process.env.PORT || 3030;
const dev = process.env.NODE_ENV !== "production" || false;

const app = next({ dev, dir: '.' });
const handle = app.getRequestHandler();


app.prepare().then( async () => {
    const server = express();

    server.use(express.json());
    server.use("/graphql", graphqlHTTP({
        schema,
        graphiql: true
    }));

    server.get("*", (req, res) => {
        return handle(req, res);
    });

    server.listen( port, (err) => {
        if( err ) throw err;
        console.info(`Server started on: http://localhost:${port}`);
    });
});