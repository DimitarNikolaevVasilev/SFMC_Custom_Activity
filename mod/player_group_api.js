const post = require('./post_request');

const assignPlayersToPlayerGroup = async ({groupId, players, operatorUsername, expirationDate}) => {
	return await post({
		url: `${process.env.player_group_api_BASE_URL}/player-groups/${groupId}/player-group-relationships`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${process.env.player_group_api_AUTH}`
		},
		body: {
			players,
			operatorUsername,
			expirationDate
		}
	});
}

const unassignPlayerToPlayerGroup = async ({groupId, playerId, operatorUsername}) => {
	return await post({
		url: `${process.env.player_group_api_BASE_URL}/players/${playerId}/player-groups-relationships/${groupId}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${process.env.player_group_api_AUTH}`
		},
		body: {
			operatorUsername
		}
	});
}



module.exports = {assignPlayersToPlayerGroup, unassignPlayerToPlayerGroup};