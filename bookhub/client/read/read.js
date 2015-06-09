if ( Meteor.isClient ) {
	Template.read.onRendered( function() {
		$('.large.icon.tool').popup();
		$('.tool').mouseover( function() {
			$(this).addClass('red');
		});
		$('.tool').mouseleave( function() {
			if ( !$(this).hasClass('marked') )
				$(this).removeClass('red');
		});
		$('.bookmark').click( function() {
			$(this).toggleClass('marked');
			if ( !$(this).hasClass('marked') )
				$(this).removeClass('red');
		});
		$('.heart').click( function() {
			$(this).toggleClass('marked');
			if ( !$(this).hasClass('marked') )
				$(this).removeClass('red');
		});
		$('.fork-btn').click( function() {
			Router.go('user');
		});
	})
}