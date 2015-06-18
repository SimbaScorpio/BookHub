if ( Meteor.isClient ) {
	Template.contributorEdit.onRendered( function() {
		$('.chapter-content-text textarea').autosize();
		document.getElementById('top').scrollIntoView();
		$('.author-btn').sticky( {                // 固定原文按钮
			offset: 50,
			context:'#page'
		});
		$('.save-btn').sticky( {                // 固定保存按钮
			offset: 110,
			context:'#page'
		});
		$('.pull-btn').sticky( {                // 固定Pull按钮
			offset: 170,
			context:'#page'
		});
	}),

	Template.contributorEdit.helpers( {
		chapter: function() {                             //原文
			var book = getBook();
			var index = Router.current().params.chapter;
			return data = {
				name: book.name,
				index: index,
				title: book.chapters[index-1].title,
				summary: book.chapters[index-1].summary,
				content: book.chapters[index-1].content
			};
		},
		forkChapter: function() {                         //预填信息：书名，章节号，章节题目，章节介绍，章节内容
			var book = getBook();
			var index = Router.current().params.chapter;
			return data = {
				name: book.name,
				index: index,
				title: book.chapters[index-1].title,
				summary: book.chapters[index-1].summary,         // fork修改声明
				content: book.chapters[index-1].content          // fork编辑内容
			};
		},
	}),

	Template.contributorEdit.events( {
		'click .author-btn': function() {
			$('.author-detail-modal').modal('show');
		},
		'click .save-btn': function() {
			var book_id = Router.current().params.book_id;
			var index = Router.current().params.chapter;

			var summary = $('.summary textarea').val();                 //修改声明
			var content = $('.chapter-content-text textarea').val();    //修改内容

			updateForkChapter( book_id, index, summary, content );      //保存编辑内容
		},
		'click .pull-btn': function() {
			$('.confirm-publish-modal').modal('show');
		},
		'click .confirm-publish-modal .right': function() {
			var book_id = Router.current().params.book_id;
			var index = Router.current().params.chapter;

			var summary = $('.summary textarea').val();                 //修改声明
			var content = $('.chapter-content-text textarea').val();    //修改内容

			updateForkChapter( book_id, index, summary, content );      //保存编辑内容
			addPullRequest( book_id, index, summary, content );         //添加pullRequest

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

function updateForkChapter( book_id, index, summary, content ) {
	/* put your code here */
}

function addPullRequest( book_id, index, summary, content ) {
	var pullRequest = {
		contributorId: Meteor.userId(),
		summary: summary,
		content: content,
		createAt: new Date(),
		isMerge: false
	}
	Novel.update( { _id: book_id }, {
		$push: ( ref$ = {}, ref$['chapters.'+(index-1)+'.pullRequest'] = pullRequest, ref$ )
	} )
}
