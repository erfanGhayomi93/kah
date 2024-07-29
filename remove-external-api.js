const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const STAGE_ENDPOINT = 'https://kahkeshanapi-stage.ramandtech.com/Common/v1/DeleteUrl';
const PREPRD_ENDPOINT = 'https://kahkeshanapi-preprd.ramandtech.com/Common/v1/DeleteUrl';
const PRODUCTION_ENDPOINT = 'https://kahkeshanapi.ramandtech.com/Common/v1/DeleteUrl';

const PASS_KEY = '3rf@n4l1F@rsh4d@l1r3z4';

const getEndpoint = (url) => {
	if (url.includes('stage')) return STAGE_ENDPOINT;
	else return PRODUCTION_ENDPOINT;
}

const addURL = (endpoint, action, brokerCode = 189) => {
	const searchParams = `?brokerCode=${brokerCode}&action=${action}&passKey=${PASS_KEY}`;

	console.log("\n");

	fetch(endpoint + searchParams, {
		method: "GET",
		redirect: "follow"
	})
		.then((response) => response.text())
		.then((result) => console.log("\x1b[33m", result, "\x1b[0m", "\n"));
}

const run = () => {
	rl.question("\x1b[34m\nEnvironment:\t\x1b[0m", (en) => {
		rl.question("\x1b[34m\nAction:\t\x1b[0m", (action) => {
			rl.close();

			try {
				let url = null;

				if (String(en).toLowerCase() === 'stage') url = STAGE_ENDPOINT;
				else if (String(en).toLowerCase() === 'preprd') url = PREPRD_ENDPOINT;
				else if (String(en).toLowerCase() === 'production') url = PRODUCTION_ENDPOINT;

				if (url === null) throw new Error();

				addURL(getEndpoint(url), action);
			} catch (e) {
				console.error('\x1b[31mURL is invalid!\x1b[0m');
			}
		});
	});
};

run();