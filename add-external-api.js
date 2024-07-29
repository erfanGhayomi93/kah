const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const STAGE_ENDPOINT = 'https://kahkeshanapi-stage.ramandtech.com';
const PRODUCTION_ENDPOINT = 'https://kahkeshanapi.ramandtech.com';

const PASS_KEY = '3rf@n4l1F@rsh4d@l1r3z4';

const getEndpoint = (environment) => {
	if (environment === 'stage') return STAGE_ENDPOINT;
	return PRODUCTION_ENDPOINT;
}

const addURL = (environment, pathname, action, brokerCode = 189) => {
	try {
		const endpoint = getEndpoint(environment);
		const url = endpoint + '/' + pathname;
		const searchParams = `?url=${url}&brokerCode=${brokerCode}&action=${action}&passKey=${PASS_KEY}`;

		fetch(endpoint + '/Common/v1/AddUrl' + searchParams, {
			method: "GET",
			redirect: "follow"
		})
			.then((response) => response.text())
			.then((result) => {
				console.log("\n");
				console.log("\x1b[33m", result, "\x1b[0m", "\n");
			});
	} catch (e) {
		console.error(`\x1b[31m${e.message}\x1b[0m`);
	}
}

const run = () => {
	rl.question("\x1b[34mPathname:\t\x1b[0m", (pathname) => {
		rl.question("\x1b[34m\nAction:\t\x1b[0m", (action) => {
			rl.close();

			try {
				const p = pathname.replace(/^\/?|\/?$/gi, "");

				addURL('stage', p, action);
				addURL('preprd', p, action);
				addURL('production', p, action);
			} catch (e) {
				console.error('\x1b[31mURL is invalid!\x1b[0m');
			}
		});
	});
};

run();