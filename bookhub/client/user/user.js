if ( Meteor.isClient ) {
	Template.user.onRendered( function() {
		$('.menu .item').tab();           // 初始化tab
		$('.create-book-modal').modal({
			selector: {
				close: '.close'
			}
		})
	}),

	Template.user.helpers( {
		user: function() {
			var id = Router.current().params.id;
			return Meteor.users.findOne( {
				_id: id
			});
		},
		selfbooks: function() {
			var id = Router.current().params.id;
			return Novel.find( {
				authorId: id
			}).fetch();
		},
		forkbooks: function() {

		},
	}),

	Template.user.events( {
		'click .tab .book': function(e) {
			$('.tab .bookface').removeClass('selected');
			$( $(e.currentTarget).find('img')[0] ).addClass('selected');
			var bookname = $( $(e.currentTarget).children('p')[0] ).html();
			$('.selected-book').html( bookname );

			var id = $($(e.currentTarget).children('p')[1]).html();            // 章节选择
			var novel = Novel.findOne( { _id: id } );

			$('.chapterSelect .menu').remove();                   // 重置menu
			$('.chapterSelect .chapters').remove();
			$('.chapterSelect .msg').after( $('<div class=\'ui secondary pointing menu\'></div>') );
			$('.chapterSelect .menu').after( $('<div class=\'chapters\'></div>') );


			if ( !novel || novel.chapters.length <= 0 ) {            // 空章节提示
				$('.chapterSelect .msg').html('暂时还没有章节:(');
			} else {
				$('.chapterSelect .msg').html('');
			}

			for ( var i = 1; i <= novel.chapters.length + 1; ++i ) {
				if ( i % 20 == 1 ) {                       // 一页20章
					var begin = i;
					var end = i + 19;
					var child1 = $('<a class=\'item\' data-tab=\''+begin+'-'+end+'\'>' + begin + '-' + end + '</a>');   // 添加菜单栏
					$('.chapterSelect .menu').append(child1);

					var child2 = $('<div class=\'ui tab\' data-tab=\''+begin+'-'+end+'\'</div>');   // 添加章节点
					for ( var j = i; j <= end && j <= novel.chapters.length; ++j ) {
						var child21 = $('<div class=\'ui button chapter\'>' + j + '</div>');
						child2.append(child21);
					}

					if ( end > novel.chapters.length ) {                // 末尾添加创建按钮+
						var child22 = $('<div class=\'ui circular green icon button chapter\'></div>');
						var child221 = $('<i class=\'plus icon\'></i>');
						child22.append(child221);
						child2.append(child22);
					}

					$('.chapterSelect .chapters').append(child2);
				}
			}
			$('.menu .item').tab();           // 初始化tab
			$( $('.chapterSelect .menu').children('.item')[0] ).addClass('active');
			$( $('.chapterSelect .chapters').children('.tab')[0] ).addClass('active');
			document.getElementById('chapterSelect').scrollIntoView();
		},
		'click .button.chapter': function(e) {
			var node1 = $( $('.self-created').find('.selected')[0] );
			var node2 = $( $(node1.parent().parent()).children('.book_id')[0] );
			var id = $(node2).html();
			var num = $(e.currentTarget).html();
			if ( isNaN(num) ) num = 'i';                  // 添加章节按钮传递i序号
			Router.go('/authorEdit/' + id + '/' + num);
		},
		'click .create-book-btn': function() {
			$('.create-book-modal').modal('show');
		},
		'submit .create-book-modal.form': function(e) {
			e.preventDefault();
			$('.create-book-modal').modal('hide');
			var curdate = new Date();
			var novel_id = Novel.insert( {
				authorId: Meteor.userId(),
				authorPseudonym: Meteor.user().profile.pseudonym,
				name: e.target.name.value,
				type: e.target.type.value,
				summary: e.target.summary.value,
				follower: [],
				createAt: curdate,
				curVersion: curdate,
				lastChapter: 0,
				versions: [],
				chapters: [],
				bookComment: []
			});
		},
	})
}