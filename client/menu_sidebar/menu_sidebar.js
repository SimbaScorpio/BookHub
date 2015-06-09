if ( Meteor.isClient ) {
	Template.menu_sidebar.events( {
		'click .menu-btn': function() {
			$('.left.menu.sidebar').sidebar( 'toggle' );
		},
		'click a': function() {
			$('.menu-btn').click();
		}
	});
}
