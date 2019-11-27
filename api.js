const express = require("express");
const express_graphql = require("express-graphql");
const {
	buildSchema
} = require("graphql");
const fs = require("fs");
const path = require("path");

const listenPort = 4000;

const serverSchema = fs.readFileSync(
	path.resolve(__dirname, "apiSchema.graphql"),
	"utf8"
);
const schema = buildSchema(serverSchema);

var coursesData = [{
		id: 1,
		title: 'The Complete Node.js Developer Course',
		author: 'Andrew Mead, Rob Percival',
		description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
		topic: 'Node.js',
		url: 'https://codingthesmartway.com/courses/nodejs/'
	},
	{
		id: 2,
		title: 'Node.js, Express & MongoDB Dev to Deployment',
		author: 'Brad Traversy',
		description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
		topic: 'Node.js',
		url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
	},
	{
		id: 3,
		title: 'JavaScript: Understanding The Weird Parts',
		author: 'Anthony Alicea',
		description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
		topic: 'JavaScript',
		url: 'https://codingthesmartway.com/courses/understand-javascript/'
	}
]

function skipData(data, skip) {
	return data.slice(skip);
}

function takeData(data, take) {
	return data.slice(0, take);
}

const rootValue = {
	course: ({filterInput = {}, pageInput = {}, orderInput = {}}) => {
		var data = coursesData;
		
		if(filterInput.id){
			data = data.filter(i => i.id == filterInput.id);
		}
		
		const {
			skip,
			take,
		} = pageInput;
		
		if (skip && take) {
			data = skipData(data, skip);
			data = takeData(data, take);
		}
		
		// if(orderInput.id){
		// 	data = data.filter(i => i.id == filterInput.id);
		// }
		
		return {
			skip: skip,
			take: take,
			hits: data.length,
			data: data,
		};
	},
};

const app = express();
app.use(
	"/graphql",
	express_graphql({
		schema: schema,
		rootValue: rootValue,
		graphiql: true
	})
);
app.listen(listenPort, () =>
	console.log(`http://localhost:${listenPort}/graphql`)
);
