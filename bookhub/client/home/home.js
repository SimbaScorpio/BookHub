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
	}),

	Template.home.helpers( {
		book: function() {
			var novels = Novel.find({}).fetch();
			return novels.length;
		},
		update: function() {
			return 0;
		},
		author: function() {
			var users = Meteor.users.find({}).fetch();
			return users.length;
		},
		contributor: function() {
			return 0;
		}
	}),

	Template.home.events( {
		'click .book': function() {
			Router.go('book');
		}
	})
}

Router.route( '/', function() {
	this.render('home');
});

Router.route( '/user/:id', function() {
	this.render('user');
})

Router.route( '/authorEdit/:book_id/:chapter', function() {
	this.render('authorEdit');
})

Router.route( '/bookIntro/:id', function() {
	this.render('bookIntro');
})

Router.map( function() {
	this.route('home');
	this.route('book');
	this.route('read');
	this.route('sign');
})