if ( Meteor.isClient ) {

	Template.menu_sidebar.helpers( {
		userphoto: function() {
			return IconsFS.findOne( {
				"metadata.authorId": Meteor.userId(),
				"metadata.iscur": 1
			});
		}
	});
	
	Template.menu_sidebar.events( {
		'click .menu-btn': function() {
			$('.left.menu.sidebar').sidebar( 'toggle' );
		},
		'click a': function() {
			$('.menu-btn').click();
		},
		'click a.signout': function() {
			Meteor.logout();
			Router.go('home');
		}
	});
}
