if ( Meteor.isClient ) {
	Template.authorEdit.onRendered( function() {
		$('.chapter-content-text textarea').autosize();
		$('.contribute-detail-modal').modal('attach events', '.contribute-brief-modal .right');
		document.getElementById('top').scrollIntoView();
	}),

	Template.authorEdit.helpers( {
		chapter: function() {
			var book = getBook();
			var index = Router.current().params.chapter;
			if ( isNaN(index) ) {
				return data = {
					name: book.name,
					index: book.lastChapter + 1,
					title: '',
					summary: '',
					content: ''
				};
			} else {
				return data = {
					name: book.name,
					index: index,
					title: book.chapters[index-1].title,
					summary: book.chapters[index-1].summary,
					content: book.chapters[index-1].content
				};
			}
		},
		puller: function() { 
			var puller = new Array;
			var index = Router.current().params.chapter;
			var pullRequest = getBook().chapters[index-1].pullRequest;

			for (var i = 0; i < pullRequest.length; ++i) {
				var contributor = Meteor.users.findOne( {
					_id: pullRequest[i].contributorId
				});
				puller.push({
					user: contributor,
					isMerge: pullRequest[i].isMerge
				});
			}
			return puller;
		}
	}),

	Template.authorEdit.events( {

		'click a': function(e) {
			$('.contribute-brief-modal').modal('show');

			var i =  $('.vertical.menu a').index(e.currentTarget) - 12;

			var index = Router.current().params.chapter;
			var pullRequest = getBook().chapters[index-1].pullRequest;
					
			var summary = pullRequest[i].summary;
			var content = pullRequest[i].content;
			$('.contribute-summary').html(summary);
			$('.contribute-content').html(content);
			$('.contribute-detail-modal .content .i').html(i);
			$('.contribute-detail-modal .content .header').html('第'+index+'章');
		},

		'click .contribute-detail-modal .right': function() {
			var i = $('.contribute-detail-modal .content .i').html();
			var book_id = Router.current().params.book_id;
			var index = Router.current().params.chapter;
			var contributorId = getBook().chapters[index-1].pullRequest[i].contributorId;

			Novel.update( { _id: book_id }, {
				$set: ( ref$ = {},
					ref$['chapters.'+(index-1)+'.pullRequest.'+i+'.isMerge'] = true,
					ref$ ),
				$push: ( ref$ = {},
					ref$['chapters.'+(index-1)+'.contributorIds'] = contributorId,
					ref$ ),
			}
	);
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
			$('.success-publish-modal').modal('setting', 'closable', false).modal('show');
		},

		'click .success-publish-modal .right': function() {
			Router.go('/user/' + Meteor.userId());
		}
	})
}

function getBook() {
	var book_id = Router.current().params.book_id;
	return book = Novel.findOne( {
		_id: book_id
	});
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
		like: 0,
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
				ref$['chapters.'+(index-1)+'.title'] = title,
				ref$['chapters.'+(index-1)+'.summary'] = summary,
				ref$['chapters.'+(index-1)+'.content'] = content,
				ref$ ),
		}
	);
}