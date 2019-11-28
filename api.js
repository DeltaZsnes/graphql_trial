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

var courseList = [{
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

function skipData(list, skip) {
	return list.slice(skip);
}

function takeData(list, take) {
	return list.slice(0, take);
}

const courseGet = (args) => {
	const {
		eq,
		nq,
		lt,
		lq,
		gt,
		ge,
		search,
		sort,
		skip,
		take,
	} = args;

	var list = courseList;

	if (eq) {
		eq.forEach(({
			key,
			set
		}) => {
			list = list.filter(i => set.includes(String(i[key])));
		});
	}

	if (nq) {
		nq.forEach(({
			key,
			set
		}) => {
			list = list.filter(i => !set.includes(String(i[key])));
		});
	}

	if (search) {
		search.forEach(key => {
			list = list.filter(i => i.description.includes(key));
		});
	}

	if (sort) {
		sort.forEach(({
			property,
			direction
		}) => {
			list = list.sort((a, b) => {
				if (a[property] > b[property]) {
					return direction ? -1 : +1;
				}
				if (b[property] > a[property]) {
					return direction ? +1 : -1;
				}
				return 0;
			});
		});
	}

	if (skip) {
		list = skipData(list, skip);
	}

	if (take) {
		list = takeData(list, take);
	}

	return {
		skip: skip,
		take: take,
		hits: list.length,
		list: list,
	};
};

const rootValue = {
	course: courseGet,
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
