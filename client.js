const fetch = require("node-fetch");

const apiUrl = `http://localhost:4000/graphql`;

const helloWorld = async() => {
	const response = await fetch("http://localhost:4000/graphql?", {"credentials":"omit","headers":{"accept":"application/json","content-type":"application/json","sec-fetch-mode":"cors"},"referrer":"http://localhost:4000/","referrerPolicy":"origin","body":"{\"query\":\"{\\n  message\\n}\",\"variables\":null}","method":"POST","mode":"cors"});
	const json = await response.json();
	console.log(json);
}

const runAsync = async () => {
	await helloWorld();
};

runAsync();
