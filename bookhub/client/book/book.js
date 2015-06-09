if ( Meteor.isClient ) {
	Template.book.onRendered( function() {
		$('.bookface').mouseover( function() {
			$(this).addClass('animated bounce');
		});
		$('.bookface').mouseleave( function() {
			$(this).removeClass('animated bounce');
		});
		$('.bookface').click( function() {
			Router.go('bookIntro');
		});
	})
}