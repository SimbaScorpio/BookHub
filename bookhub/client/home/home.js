if ( Meteor.isClient ) {
	Template.home.onRendered( function() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		$('.homepage').css( 'width', w );
		$('.homepage').css( 'height', h );
		$('.circle').mouseover( function() {
			$(this).addClass('animated rubberBand');
		});
		$('.circle').mouseleave( function() {
			$(this).removeClass('animated rubberBand');
		});
		$('.book').click( function() {
			Router.go('book');
		});
	})
}

Router.route( '/', function() {
	this.render('home');
});
Router.map( function() {
	this.route('home');
	this.route('book');
	this.route('read');
	this.route('bookIntro');
	this.route('user');
	this.route('authorEdit');
	this.route('sign');
})