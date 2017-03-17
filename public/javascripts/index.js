    $('.sidej').on('click',function(){
		$('body,html').animate({
			"scroll-top":0
		},1000);
	});
	(function(){
		$(document).on('scroll',function(){
			var Dt = $(document).scrollTop();
			if(Dt > 200){
				$('.sidej').fadeIn(300);
			}else{
				$('.sidej').fadeOut(300);
			}
		})
	}());