(function(){
	'use strict';
	var connection = new Postmonger.Session();
	var payload = {};
	var heroku_url = "https://sfmc-custom-activity11.herokuapp.com";
	var eventDefinitionKey;

	$(window).ready(onRender);

	connection.on('initActivity', initialize);

	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('gotoStep', onGotoStep);

	function onRender() {
		connection.trigger('ready');
		connection.trigger('requestTokens');
		connection.trigger('requestEndpoints');
		connection.trigger('requestTriggerEventDefinition');
	}

	connection.on('requestedTriggerEventDefinition', function(event){
		console.log(event);
		eventDefinitionKey = event.eventDefinitionKey;
	});


	function initialize (data) {
		console.log('initialize', data);

		if (data) payload = data;



		var hasInArguments = Boolean(
			payload['arguments'] &&
			payload['arguments'].execute &&
			payload['arguments'].execute.inArguments &&
			payload['arguments'].execute.inArguments.length > 0
		);

		var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
		var d = payload['metaData'].data;


		$('#groupId').val(d.groupId);
		$('#type').val(d.type);
		$('#days').val(d.days);
	}

	function onClickedNext () {
		save();
	}

	function onClickedBack () {
		console.log('clickedBack');
		connection.trigger('prevStep');
	}

	function onGotoStep (step) {
		connection.trigger('ready');
	}


	function save() {
		var type = $('#type').val();
		var groupId = $('#groupId').val();
		var days = $('#days').val();

		if(!groupId || !days){
			$('#error_div').html('Rellene todos los campos');
			return connection.trigger('ready'); // esto o return false;
		}else{
			$('#error_div').html('');
		}


		//payload.name = name;

		payload['metaData'].data = {type, groupId, days};

		payload['arguments'].execute.inArguments = [{
			playerId: '{{Contact.Attribute.Test_CA.ID}}',
			type,
			groupId,
			days
		}];
		payload['metaData'].isConfigured = true;
		connection.trigger('updateActivity', payload);
	}
})();