const fetch = require("node-fetch");

const coursesA = async () => {
	const response = await fetch("http://localhost:4000/graphql?", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en,sv;q=0.9,ja;q=0.8,fil;q=0.7","cache-control":"no-cache","content-type":"application/json","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"http://localhost:4000/","referrerPolicy":"origin","body":"{\"query\":\"{\\n  courses(pageInput: {skip: 0, take: 999}) {\\n    skip\\n    take\\n    hits\\n    data {\\n      ... on Course {\\n        id\\n        title\\n        topic\\n        author\\n        url\\n        description\\n      }\\n    }\\n  }\\n}\\n\",\"variables\":null}","method":"POST","mode":"cors"});
	const json = await response.json();
	console.log(json)
}

const coursesB = async () => {
	const response = await fetch("http://localhost:4000/graphql?", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en,sv;q=0.9,ja;q=0.8,fil;q=0.7","cache-control":"no-cache","content-type":"application/json","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"http://localhost:4000/","referrerPolicy":"origin","body":"{\"query\":\"query {\\n  courses(quiz: { skip: 0 take: 999 }){\\n    skip\\n    take\\n    hits\\n    data {\\n      ...CourseFragment\\n    }\\n  }\\n}\\n\\nfragment CourseFragment on Course{\\n  id\\n  title\\n  topic\\n  author\\n  url\\n  description\\n}\",\"variables\":null}","method":"POST","mode":"cors"});
	const json = await response.json();
	console.log(json)
}

const runAsync = async () => {
	await coursesA();
	//await coursesB();
};

runAsync();
