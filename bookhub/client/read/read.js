if ( Meteor.isClient ) {
	Template.read.onRendered( function() {
		$('.large.icon.tool').popup();
		$('.tool').mouseover( function() {
			$(this).addClass('red');
		});
		$('.tool').mouseleave( function() {
			if ( !$(this).hasClass('marked') )
				$(this).removeClass('red');
		});
		$('.bookmark').click( function() {
			$(this).toggleClass('marked');
			if ( !$(this).hasClass('marked') )
				$(this).removeClass('red');
		});
		$('.heart').click( function() {
			$(this).toggleClass('marked');
			if ( !$(this).hasClass('marked') )
				$(this).removeClass('red');
		});
		$('.fork-btn').click( function() {
			Router.go('user');
		});
	}),
	Template.read.helpers( {
		book: function() {
			var id = Router.current().params.id;
			var novel = Novel.findOne( {
				_id: id
			});
			return novel;
		},
		author: function() {
			var id = Router.current().params.id;
			var novel = Novel.findOne( {
				_id: id
			});
			return Meteor.users.findOne( {
				_id: novel.authorId
			});
		},
		chapter: function() {
			var id = Router.current().params.id;
			var novel = Novel.findOne( {
				_id: id
			});
			var chapter = Router.current().params.chapter;
			return novel.chapters[Number(chapter)-1];
		},
		reviewer: function() {
			var id = Router.current().params.id;
			var novel = Novel.findOne( {
				_id: id
			});
			var chapter = Router.current().params.chapter;
			var result = [];
			var comments = novel.chapters[Number(chapter)-1].comment;
			for (item in novel.chapters[Number(chapter)-1].comment) {
				var user = Meteor.users.findOne( {
				    _id: comments[item].reviewerId
			    });
				result.push({
					name : user.username,
					content : comments[item].content,
					createAt : comments[item].createAt
				});
			}
			return result;
		},
		pullRequest: function() {
			var id = Router.current().params.id;
			var novel = Novel.findOne( {
				_id: id
			});
			var chapter = Router.current().params.chapter;
			var pullRequests = novel.chapters[Number(chapter)-1].pullrequest;
			var result = 0;
			for (item in pullRequests) {
				if (pullRequests[item].isMerge) result++;
			}
			return result;
		} 
	}),
	Template.read.events({
		'click .form .submit' : function(e) {
			var book_id = Router.current().params.id;
			var content = $('.field textarea').val();
			if (content == '') {
				alert('请输入内容后评论');
				return;
			}
			var index = Number(Router.current().params.chapter);
			var reviwerId = Meteor.userId();
			insertNovelChapterComment(book_id, index, reviwerId, content);
		}
	})
}
function insertNovelChapterComment (book_id, index, reviewId, content) {
	var curdate = new Date();
	var comment = {
		reviewerId: reviewId,
		content: content,
		createAt:curdate
	};
	Novel.update( { _id: book_id }, {
			$push:(ref$ = {},
				ref$['chapters.' + (index-1) +'.comment'] = comment,
				ref$),
		}
	);
	$('.field textarea').val('');
}