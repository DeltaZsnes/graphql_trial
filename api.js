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
	course: ({filter = {}, paging = {}, sort = []}) => {
		var data = coursesData;
		
		if(filter.eq){
			filter.eq.forEach(({A, B}) => {
				data = data.filter(i => i[A] == B);
			});
		}
		
		if(filter.nq){
			filter.nq.forEach(({A, B}) => {
				data = data.filter(i => i[A] != B);
			});
		}
		
		const {
			skip,
			take,
		} = paging;
		
		if (skip && take) {
			data = skipData(data, skip);
			data = takeData(data, take);
		}
		
		sort.forEach(({
			property,
			direction
		}) => {
			data = data.sort((a, b) => {
				if (a[property] > b[property]) {
					return direction ? -1 : +1;
				}
				if (b[property] > a[property]) {
					return direction ? +1 : -1;
				}
				return 0;
			});
		});
		
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
