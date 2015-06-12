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
			$('.bookface').removeClass('selected');
			$(this).addClass('selected');
		})
	}),

	Template.user.helpers( {
		user: function() {
			var username = Router.current().params.username;
			return Meteor.users.findOne( {
				username: username
			});
		},
		arr: getArr,
		arr2: getArr2
	}),

	Template.user.events( {
		'click .button.chapter': function() {
			Router.go('authorEdit');
		}
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