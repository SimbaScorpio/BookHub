if ( Meteor.isClient ) {
	Template.bookIntro.onRendered( function() {
		$('.menu .item').tab();
	}),
	Template.bookIntro.helpers( {
		novelCover: function() {
			return FilesFS.findOne({ 'metadata.novelId': Router.current().params.id });
		},
		novel: function() {
			var id = Router.current().params.id;
			return Novel.findOne( {
				_id: id
			});
		},
		comments: function() {
			var comments = new Array;
			var id = Router.current().params.id;
			var novel = Novel.findOne( {
				_id: id
			});
			var i;
			for(i = 0; i < novel.novelComments.length; i++){
				var user = Meteor.users.findOne( { _id: novel.novelComments[i].reviewerId});
				comments.push({
					reviewer: user.profile.pseudonym, 
					content: novel.novelComments[i].content,
				    createAt: getDateDiff(novel.novelComments[i].createAt)}
				);
			}
			return comments;
		},
		init: selectmenu,
		amountContributor: getAmount
	}),
	Template.bookIntro.events( {
		'click .submit.icon.button': function(e) {
			e.preventDefault();
			var content = $('textarea').val();
			var reviewerId = Meteor.userId();
			insertNovelComment(reviewerId, content);
		},
		'click .chapter': function(e) {
			var id = Router.current().params.id;
			var num = $(e.currentTarget).html();
			Router.go('/read/' + id + '/' + num);
		}
	})
}

function insertNovelComment(reviewerId, content) {
	var id = Router.current().params.id;
	var novel_id = id;
	var curdate = new Date();
	var comment = {
		reviewerId: reviewerId,
		content: content,
		createAt: curdate
	};
	Novel.update( {_id: novel_id}, {
		$push: {novelComments: comment}
	});
}


function getAmount() {
	var contributors = new Array;
	var id = Router.current().params.id;
	var novel = Novel.findOne( {
		_id: id
	});
    // var chapters = novel.chapters;
    
    for(var i = 0; i < novel.chapters.length; i++){
    	for(var j = 0; j < novel.chapters[i].contributorIds.length; j++){
			if(contributors.indexOf(novel.chapters[i].contributorIds[j]) == -1)
				contributors.push(novel.chapters[i].contributorIds[j]);
    	}
    }
	return contributors.length;
}

function selectmenu(){
	var id = Router.current().params.id;
	var novel = Novel.findOne( {
		_id: id
	});

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
			$('.chapterSelect .chapters').append(child2);
		}
	}
	$('.menu .item').tab();           // 初始化tab
	$( $('.chapterSelect .menu').children('.item')[0] ).addClass('active');
	$( $('.chapterSelect .chapters').children('.tab')[0] ).addClass('active');
}


function getDateDiff(dateTimeStamp){
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
	if(monthC>=1){
		result="发表于" + parseInt(monthC) + "个月前";
	}
	else if(weekC>=1){
		result="发表于" + parseInt(weekC) + "周前";
	}
	else if(dayC>=1){
		result="发表于"+ parseInt(dayC) +"天前";
	}
	else if(hourC>=1){
		result="发表于"+ parseInt(hourC) +"个小时前";
	}
	else if(minC>=1){
		result="发表于"+ parseInt(minC) +"分钟前";
	}else
		result="刚刚发表";
	return result;
}
