if ( Meteor.isClient ) {
	Template.authorEdit.onRendered( function() {
		$('.chapter-content-text textarea').autosize();
		$('.contribute-detail-modal').modal('attach events', '.contribute-brief-modal .right');
		document.getElementById('top').scrollIntoView();
	}),
	Template.authorEdit.helpers( {
		chapter: function() {
			var book_id = Router.current().params.book_id;
			var index = Router.current().params.chapter;
			var book = Novel.findOne( {
				_id: book_id
			});
			if ( isNaN(index) ) {
				return data = {
					name: book.name,
					index: book.lastchapter + 1,
					title: '',
					summary: '',
					content: ''
				};
			} else {
				return data = {
					name: book.name,
					index: index,
					title: book.chapter[index-1].title,
					summary: book.chapter[index-1].summary,
					content: book.chapter[index-1].content
				};
			}
		}
	}),
	Template.authorEdit.events( {
		'click a': function() {
			$('.contribute-brief-modal').modal('show');
		},
		'click .submit-btn': function() {
			$('.confirm-publish-modal').modal('show');
		},
		'click .confirm-publish-modal .right': function() {
			var title = $('.title input').val();
			var summary = $('.summary textarea').val();
			var content = $('.chapter-content-text textarea').val();
			var index = Router.current().params.chapter;
			var book_id = Router.current().params.book_id;
			if ( isNaN(index) ) {
				insertNovelChapter(book_id, index, title, summary, content);
			} else {
				updateNovelChapter(book_id, index, title, summary, content);
			}
			$('.success-publish-modal').modal('show');
		},
		'click .success-publish-modal .right': function() {
			Router.go('/user/' + Meteor.userId());
		}
	})
}

function insertNovelChapter( book_id, index, title, summary, content ) {
	var curdate = new Date();
	var lastChapter = Novel.findOne( {_id: book_id} ).lastChapter + 1;
	var chapter = {
		index: lastChapter,
		title: title,
		summary: summary,
		content: content,
		contributorIds: [],
		createAt: curdate,
		modifyAt: curdate,
		comment: [],
		pullRequest: []
	};
	Novel.update( {_id: book_id}, {
		$inc: {lastChapter: 1},
		$push: {chapters: chapter}
	});
}

function updateNovelChapter( book_id, index, title, summary, content ) {
	Novel.update( { _id: book_id }, {
			$set: ( ref$ = {},
				ref$['chapter.'+(index-1)+'.title'] = title,
				ref$['chapter.'+(index-1)+'.summary'] = summary,
				ref$['chapter.'+(index-1)+'.content'] = content,
				ref$ ),
		}
	);
}