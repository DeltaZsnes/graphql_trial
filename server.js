const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");
const path = require("path");

const listenPort = 4000;

const serverSchema = fs.readFileSync(
	path.resolve(__dirname, "serverSchema.graphql"),
	"utf8"
);
const schema = buildSchema(serverSchema);

const rootValue = {
	message: () => "Hello World!"
};

const app = express();
app.use(
	"/graphql",
	express_graphql({
		schema,
		rootValue,
		graphiql: true
	})
);
app.listen(listenPort, () =>
	console.log(`http://localhost:${listenPort}/graphql`)
);
