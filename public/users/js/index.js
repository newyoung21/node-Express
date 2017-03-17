
	$('.panel ul a').each(function(index, el) {

		if($($(this))[0].href==String(window.location)) {
			
			$(this).parent().parent().addClass('in');
			$(this).addClass('act');
			
		}
	});
