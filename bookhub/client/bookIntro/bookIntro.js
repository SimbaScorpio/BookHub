if ( Meteor.isClient ) {
	Template.bookIntro.onRendered( function() {
		$('.menu .item').tab();
		$('.chapter').click( function() {
			Router.go('read');
		})
	}),
	Template.bookIntro.helpers( {
		arr: getArr
	})
}
function getArr() {
	var arr = new Array;
	var i;
	for ( i=1; i<18; ++i ) {
		arr.push( {id:i} );
	}
	return arr;
}