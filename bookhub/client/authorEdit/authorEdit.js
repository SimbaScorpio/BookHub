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

				var pullerPhoto = IconsFS.findOne({
					"metadata.authorId": contributor._id,
					"metadata.iscur": 1
				});

				puller.push({
					user: contributor,
					pullerPhoto: pullerPhoto,
					isMerge: pullRequest[i].isMerge
				});
			}			

			return puller;
		}
	}),

	Template.authorEdit.events( {

		'click .pull-request-list a.item': function(e) {
			e.stopPropagation();
			$('.contribute-brief-modal').modal('show');
			var summary, content;
			var id = e.target.id;
			Session.set('contributorIdSelected', id);

			var index = Router.current().params.chapter;
			var pullRequest = getBook().chapters[index-1].pullRequest;

			for (var i = 0; i < pullRequest.length; i++) {
				if (pullRequest[i].contributorId == id) {
					summary = pullRequest[i].summary;
					content = pullRequest[i].content;
					break;
				}
			}

			var pullerPhoto = IconsFS.findOne({
				"metadata.authorId": id,
				"metadata.iscur": 1
			});
			
			$('.contribute-brief-modal .ui.medium.image').children().remove();
			if (pullerPhoto) {
				$('.contribute-brief-modal .ui.medium.image').append('<img src="/userphoto-img/' + pullerPhoto.copies.userphoto.key + '"/>');
			} else {
				$('.contribute-brief-modal .ui.medium.image').append('<img src="/img/default-userphoto.jpg"');
			}

			$('.contribute-summary').html(summary);
			$('.contribute-content').html(content);
			$('.contribute-detail-modal .content .header').html('第'+index+'章');
		},

		'click .contribute-detail-modal .right': function() {
			var book_id = Router.current().params.book_id;
			var index = Router.current().params.chapter;
			var contributorId = Session.get('contributorIdSelected');
			var pullRequest = getBook().chapters[index-1].pullRequest;
			var pullRequestIndex = 0, summary, content;
			var date = new Date();

			for (var i = 0; i < pullRequest.length; i++) {
				if (pullRequest[i].contributorId == contributorId) {
					pullRequestIndex = i;
					summary = pullRequest[i].summary;
					content = pullRequest[i].content;
					break;
				}
			}

			Novel.update( { _id: book_id }, {
				$set: ( ref$ = {},
					ref$['chapters.'+(index-1)+'.pullRequest.'+pullRequestIndex+'.isMerge'] = true,
					ref$ ),
				$addToSet: ( ref$ = {},
					ref$['chapters.'+(index-1)+'.contributorIds'] = contributorId,
					ref$ ),
				$set: ( ref$ = {},
					ref$['chapters.'+(index-1)+'.summary'] = summary,
					ref$['chapters.'+(index-1)+'.content'] = content,
					ref$['chapters.'+(index-1)+'.modifyAt'] = date,
					ref$ ),
			});
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