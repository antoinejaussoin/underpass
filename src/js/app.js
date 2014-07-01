$(function(){
	var link = $('#link');
	var fileName = $("#name");
	var button = $('#download');

	link.on('input propertychange paste', function(){
		var value = link.val();
		console.log(value);

		var splits  = value.split('/');
		var possibleFileName = splits[splits.length - 1];
		var fileNameSplits = possibleFileName.split('.');
		if (fileNameSplits.length > 1){
			var extension = fileNameSplits[fileNameSplits.length - 1];

			if (extension.length === 3){
				fileName.val(possibleFileName);
				checkValidity();
				return;
			}
		}

		fileName.val('');
		checkValidity();
	});

	fileName.on('input propertychange paste', function(){
		checkValidity();
	});

	function checkValidity(){
		var isValid = link.val().length > 8 && fileName.val().length >= 3;

		if (isValid) {
			button.attr('disabled', false);
		} else {
			button.attr('disabled', true);
		}
	}

});

