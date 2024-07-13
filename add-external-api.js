const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const STAGE_ENDPOINT = 'https://kahkeshanapi-stage.ramandtech.com/Common/v1/AddUrl';
const PREPRD_ENDPOINT = 'https://kahkeshanapi-preprd.ramandtech.com/Common/v1/AddUrl';
const PRODUCTION_ENDPOINT = 'https://kahkeshanapi.ramandtech.com/Common/v1/AddUrl';

const PASS_KEY = '3rf@n4l1F@rsh4d@l1r3z4';

const getEndpoint = (url) => {
	if (url.includes('stage')) return STAGE_ENDPOINT;
	else if (url.includes('preprd')) return PREPRD_ENDPOINT;
	else return PRODUCTION_ENDPOINT;
}

const addURL = (endpoint, url, action, brokerCode = 189) => {
	const searchParams = `?url=${url}&brokerCode=${brokerCode}&action=${action}&passKey=${PASS_KEY}`;

	console.log("\n");

	fetch(endpoint + searchParams, {
		method: "GET",
		redirect: "follow"
	})
		.then((response) => response.text())
		.then((result) => console.log("\x1b[33m", result, "\x1b[0m", "\n"));
}

const run = () => {
	rl.question("\x1b[34mURL:\t\x1b[0m", (url) => {
		rl.question("\x1b[34m\nAction:\t\x1b[0m", (action) => {
			rl.close();

			try {
				new URL(url);
				addURL(getEndpoint(url), url, action);
			} catch (e) {
				console.error('\x1b[31mURL is invalid!\x1b[0m');
			}
		});
	});
};

run();