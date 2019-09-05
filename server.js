var express = require("express");
var express_graphql = require("express-graphql");
var { buildSchema } = require("graphql");

const listenPort = 4000;

// GraphQL schema
var schema = buildSchema(`
type Query {
    message: String
}
`);

var root = {
	message: () => "Hello World!"
};

var app = express();
app.use(
	"/graphql",
	express_graphql({
		schema: schema,
		rootValue: root,
		graphiql: true
	})
);
app.listen(listenPort, () =>
	console.log(`http://localhost:${listenPort}/graphql`)
);
