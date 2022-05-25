console.log("Loading...");

require('./mod/check_env')();

const security = require('./mod/security');
var sfmc = require('./mod/sfmc');
const api = require('./mod/player_group_api');

var port = process.env.PORT || 3000;
//proxy = 'http://proxy.URL.es:8080';


var app = require('./mod/server');


app.post('/save', security.check_token, (req, res) => {
	console.log(req.body, req.query);
	res.status(200).end();

});
app.post(/(publish|validate)/, security.check_token, (req, res) => {
	res.status(200).end();
});

app.post('/execute', security.check_token, (req, res) => {
	console.log('EXECUTE BODY: ', req.rawBody, req.body);

	var arg = req.body.inArguments[0];
	let result;

	if(!arg.playerId)arg.playerId = '217fcdec895fd018';

	const run = async () => {
		try {
			if (arg.type === 'POST') {
				result = await api.assignPlayersToPlayerGroup({
					groupId: arg.groupId,
					players: [arg.playerId],
					operatorUsername: process.env.operator,
					expiration: new Date((new Date()).getTime() + (86400000 * arg.days)).toUTCString()
				});
			} else if (arg.type === 'DELETE') {
				result = await api.unassignPlayerToPlayerGroup({
					groupId: arg.groupId,
					playerId: arg.playerId,
					operatorUsername: process.env.operator
				});
			}
		} catch (error) {
			result = {
				body: JSON.stringify(error),
				response: {statusCode: 0}
			};
		}

		sfmc.log({
			date: new Date(),
			playerId: arg.playerId,
			playerGroupId: arg.groupId,
			status: result.response.statusCode,
			responseText: result.body
		});

		res.status(result.response.statusCode === 200 ? 200 : 500).end();
	}

	run();
});

async function test() {
	/*	let result = await sfmc.log({
			playerGroupId: 'test',
			date: new Date(),
			status: 200,
			responseText: 'RESPONSE TEST'
		});*/
	let result = api.assignPlayersToPlayerGroup({
		groupId: '609a5ddd-f8a7-4868-9a8a-1492fda9f99c',
		players: ['217fcdec895fd018'],
		operatorUsername: 'RubenTest',
		expiration: (new Date).toUTCString()
	}).then(({body, response}) => {
		console.log(body);
		console.log(response);

	}).catch(({error}) => {
		console.log(error);
	});
}


//test();


var server = app.listen(port, () => {
	console.log('Server is listening on port ', port);
});
