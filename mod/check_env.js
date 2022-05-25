module.exports = function(){
	var missing = false;
	[
		'client_id',
		'client_secret',
		'server_domain',
		'log_de',
		'player_group_api_BASE_URL',
		'player_group_api_AUTH'
	].forEach(d => {
		if(!process.env[d]){
			missing = true;
			console.error(d + ' environment variable is missing');
		}
	});
	if(missing)process.exit(1);
}