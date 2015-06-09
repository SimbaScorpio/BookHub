if ( Meteor.isClient ) {
	Template.authorEdit.onRendered( function() {
		// $('.summernote').summernote( {
		// 	toolbar: [
		// 		['basic', ['bold', 'italic', 'underline', 'clear']],
		// 		['fontname', ['fontname']],
		// 		['fontsize', ['fontsize']],
		// 		['style', ['style']],
		// 		['color', ['color']],
		// 		['para', ['ul', 'ol', 'paragraph']],
		// 		['height', ['height']],
		// 		['fullscreen', ['fullscreen']],
		// 		['play', ['undo', 'redo']]
		// 	],
		// 	height: 500
		// });	
		// $('.submit-btn').click( function() {
		// 	var txt = $('.summernote').code();
		// 	alert(txt);
		// });
		$('textarea').autosize();
		$('.contribute-detail-modal').modal('attach events', '.contribute-brief-modal .detail');
	}),
	Template.authorEdit.events( {
		'click a': function() {
			$('.contribute-brief-modal').modal('show');
		}

	})
}