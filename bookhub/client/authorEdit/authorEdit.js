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
					bookname: book.novelname,
					index: book.lastchapter + 1,
					title: '',
					introduction: '',
					content: ''
				};
			} else {
				return data = {
					bookname: book.novelname,
					index: index,
					title: book.chapter[index-1].title,
					introduction: book.chapter[index-1].information,
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
			var intro = $('.intro textarea').val();
			var content = $('.chapter-content-text textarea').val();
			var index = Router.current().params.chapter;
			var book_id = Router.current().params.book_id;
			if ( isNaN(index) ) {
				insertNovelChapter(book_id, index, title, intro, content);
			} else {
				updateNovelChapter(book_id, index, title, intro, content);
			}
			$('.success-publish-modal').modal('show');
		},
		'click .success-publish-modal .right': function() {
			Router.go('/user/' + Meteor.user().username);
		}
	})
}

function insertNovelChapter( book_id, index, title, information, content ) {
	var curdate = new Date();
	var lastchapter = Novel.findOne( {_id: book_id} ).lastchapter + 1;
	var chapter = {
		index: lastchapter,
		title: title,
		information: information,
		content: content,
		contributor_id: [],
		createAt: curdate,
		modifyAt: curdate,
		comment: [],
		pullrequest: []
	};
	Novel.update( {_id: book_id}, {
		$inc: {lastchapter: 1},
		$push: {chapter: chapter}
	});
}

function updateNovelChapter( book_id, index, title, information, content ) {
	Novel.update( { _id: book_id }, {
			$set: ( ref$ = {},
				ref$['chapter.'+(index-1)+'.title'] = title,
				ref$['chapter.'+(index-1)+'.information'] = information,
				ref$['chapter.'+(index-1)+'.content'] = content,
				ref$ ),
		}
	);
}