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
		chapters: chaptersDivider,
		amountContributor: getAmount,
		isThefirstChapter: function(order) {
			return order == '1-20';
		},
		isForked: function() {
			var novelId = Router.current().params.id;
			var user = Meteor.users.findOne({ _id: Meteor.userId() });

			if (Novel.findOne({ _id: novelId }).authorId == Meteor.userId()) {
				return true;
			}

			for (var i = 0; i < user.profile.fork.length; i++) {
				if (user.profile.fork[i].novelId == novelId) {
					return true;
				}
			}
			return false;
		},
		userPhoto: function() {
			return IconsFS.findOne( {
				"metadata.authorId": Meteor.userId(),
				"metadata.iscur": 1
			});
		}

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
		},
		'click .bookIntro-pusher .book-btn .fork': function(e) {
			var novelId = Router.current().params.id;
			var date = new Date();
			Meteor.users.update(
				{ _id: Meteor.userId() },
				{ $addToSet: 
					{ 'profile.fork': 
						{ 'novelId': novelId, createAt: date, content: null }
					}
				}
			);
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

    for(var i = 0; i < novel.chapters.length; i++){
    	for(var j = 0; j < novel.chapters[i].contributorIds.length; j++){
			if(contributors.indexOf(novel.chapters[i].contributorIds[j]) == -1)
				contributors.push(novel.chapters[i].contributorIds[j]);
    	}
    }
	return contributors.length;
}

function chaptersDivider(){
	var id = Router.current().params.id;
	var novel = Novel.findOne( {
		_id: id
	});
	var novelsArray = [];

	for (var i = 0; 20 * i < novel.chapters.length; i++) {
		var eachArray = [];
		for (var j = 0; j < 20 && 20 * i + j < novel.chapters.length; j++) {
			eachArray.push(20 * i + j + 1);
		}
		novelsArray.push({
			button: eachArray, 
			tab: (i * 20 + 1) + '-' + (i + 1) * 20
		});
	}

	return novelsArray;
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
