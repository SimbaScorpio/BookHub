if ( Meteor.isClient ) {
	Template.authorEdit.onRendered( function() {
		$('.chapter-content-text textarea').autosize();
		$('.contribute-detail-modal').modal('attach events', '.contribute-brief-modal .right');
		document.getElementById('top').scrollIntoView();
	}),
	Template.authorEdit.events( {
		'click a': function() {
			$('.contribute-brief-modal').modal('show');
		},
		'click .submit-btn': function() {
			$('.confirm-publish-modal').modal('show');
		},
		'click .confirm-publish-modal .right': function() {
			$('.success-publish-dimmer').dimmer('show');
		}
	})
}