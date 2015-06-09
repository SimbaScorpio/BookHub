if ( Meteor.isClient ) {
	Template.user.onRendered( function() {
		$('.menu .item').tab();
		$('.bookface').click( function() {
			var bookname = $(this).parent().next('p').html();
			$('.selected-book').html( bookname );
			if ( $('.forked').hasClass('active') ) {
				$('.arr').removeClass('active');
				$('.arr2').addClass('active');
			} else {
				$('.arr').addClass('active');
				$('.arr2').removeClass('active');
			}
		});
		$('.button.chapter').click( function() {
			Router.go('authorEdit');
		})

	}),
	Template.user.helpers( {
		arr: getArr,
		arr2: getArr2
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
function getArr2() {
	var arr = new Array;
	var i;
	for ( i=1; i<18; ++i ) {
		if ( i%3 == 0 )
			arr.push( {id:i} );
	}
	return arr;
}