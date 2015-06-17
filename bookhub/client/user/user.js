if ( Meteor.isClient ) {
	Template.user.onRendered( function() {
		$('.menu .item').tab();           // 初始化tab
		$('.create-book-modal').modal({
			selector: {
				close: '.close'
			}
		});
		//--- edited by LY ---
        $('.edit-userphoto-modal').modal({
            selector: {
                close: '.close'
            }
        });
        //--- edited by LY ---
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
	        //--- edited by LY ---
            return FilesFS.find( {
                "metadata.authorId": id
            }).fetch();
            //--- edited by LY ---
		},
		forkbooks: function() {
			var forkNovels = Meteor.users.findOne({ _id: Meteor.userId()}).profile.fork;
			var forkNovel = [];
			for (var i = 0; i < forkNovels.length; i++) {
				forkNovel.push(FilesFS.findOne({ 
					'metadata.novelId': forkNovels[i].novelId
				}));
			}
			return forkNovel;
		},
		userphoto: function() {
			var id = Router.current().params.id;
			return IconsFS.findOne( {
				"metadata.authorId": id,
				"metadata.iscur": 1
			});
		}
	}),

	Template.user.events( {
		'click .tab .book': function(e) {
			$('.tab .bookface').removeClass('selected');
			$( $(e.currentTarget).find('img')[0] ).addClass('selected');
			var bookname = $( $(e.currentTarget).children('p')[0] ).html();
			$('.selected-book').html( bookname );

			var id = $($(e.currentTarget).children('p')[1]).html();            // 章节选择
			var novel = Novel.findOne( { _id: id } );
			addSelectMenu(novel, $(e.target).parent().parent());
		},
		'click .chapterSelect .button.ui': function(e) {
			console.log(e.target);
			if ($(e.target).hasClass('self-chapter')) {
				var node1 = $( $('.self-created').find('.selected')[0] );
				var node2 = $( $(node1.parent().parent()).children('.book_id')[0] );
				var id = $(node2).html();
				var num = $(e.currentTarget).html();
				if ( isNaN(num) ) num = 'i';                  // 添加章节按钮传递i序号
				
				Router.go('/authorEdit/' + id + '/' + num);
			} else {
				var node1 = $( $('.forked').find('.selected')[0] );
				var node2 = $( $(node1.parent().parent()).children('.book_id')[0] );
				var id = $(node2).html();
				var num = $(e.currentTarget).html();
				if ( isNaN(num) ) num = 'i';                  // 添加章节按钮传递i序号
				var chapterLength = Novel.findOne({ _id: id}).chapters.length;
				if (num == chapterLength) {
					Router.go('/contributorEdit/' + id + '/' + num);
					return;
				}
				
				Router.go('/read/' + id + '/' + num);
			}

		},
		'click .create-book-btn': function() {
			$('.create-book-modal').modal('show');
		},
		'click .fork-book-btn': function() {
			Router.go('/book');
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
				pv: 0,
				follower: [],
				createAt: curdate,
				curVersion: curdate,
				lastChapter: 0,
				versions: [],
				chapters: [],
				novelComments: []
			});
			//--- edited by LY ---
            var pics = $('#bookface')[0].files;
            for (var i = 0, ln = pics.length; i < ln; i++) {
              var pic = pics[i];
              var newpic = new FS.File(pic);
              newpic.metadata = {
                authorId: Meteor.userId(),
                novelId: novel_id,
                novelname: e.target.name.value,
                haspic: 1
              }
              FilesFS.insert(newpic);
            }
            if (pics.length == 0) {
              var newpic = new FS.File();
              newpic.metadata = {
                authorId: Meteor.userId(),
                novelId: novel_id,
                novelname: e.target.name.value,
                haspic: 0
              }
              FilesFS.insert(newpic);
            }

            // 按提交之后表单都要清空
            e.target.name.value = ''
            e.target.type.value = ''
            e.target.summary.value = ''
            e.target.bookface.value = ''
            $('.edit-bookface-div').fadeOut();
            $('#edit-bookface').attr("src","/img/default-bookface.jpg");
			//--- edited by LY ---
		},
		//--- edited by LY ---
		'click #userphoto': function() {
            $('.edit-userphoto-modal').modal('show');
        },
        'click #edit-bookface': function() {
            $('.edit-bookface-div').fadeToggle();
        },
        'change #bookface': function(e) {
            var docObj = document.getElementById("bookface");
            var imgObjPreview = document.getElementById("edit-bookface");
            if (docObj.files && docObj.files[0]){            
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            }
        },
        'change #newUserphoto': function(e) {
            var docObj = document.getElementById("newUserphoto");
            var imgObjPreview = document.getElementById("edit-userphoto");
            $('.upload-userphoto').removeClass('no-display');
            if (docObj.files && docObj.files[0]){            
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            }
        },
		'submit .edit-userphoto-modal.form': function(e) {
			e.preventDefault();
			$('.edit-userphoto-modal').modal('hide');
			var curdate = new Date();

			//--- edited by LY ---
            var pics = $('#newUserphoto')[0].files;
            for (var i = 0, ln = pics.length; i < ln; i++) {
              var pic = pics[i];
              var newpic = new FS.File(pic);

              Meteor.call('update-userphoto');

              newpic.metadata = {
                authorId: Meteor.userId(),
                iscur: 1
              }
              IconsFS.insert(newpic);
            }
            

            // 按提交之后表单都要清空
            e.target.newUserphoto.value = ''
            $('.upload-userphoto').addClass('no-display');
			//--- edited by LY ---
		},
		'click .user-pusher .ui.secondary.pointing.menu .item': function(e) {
			$('.user-pusher .ui.segment.chapterSelect').children().remove();
			var child1 = $('<div class=\'ui black ribbon label selected-book\'> ? </div>');
			var child2 = $('<div class=\'ui aligned center header msg\'> 请选择一本书 </div>');
			$('.user-pusher .ui.segment.chapterSelect').append(child1, child2);
		}
	})
}

function addSelectMenu( novel, clickBook ) {
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
				var child21;
				if (clickBook.hasClass('selfbook')) {
					child21 = $('<div class=\'ui button self-chapter\'>' + j + '</div>');
				} else {
					child21 = $('<div class=\'ui button fork-chapter\'>' + j + '</div>');
				}
				child2.append(child21);
			}

			if (clickBook.hasClass('selfbook')) {
				if ( end > novel.chapters.length ) {                // 末尾添加创建按钮+
					var child22 = $('<div class=\'ui circular green icon button self-chapter\'></div>');
					var child221 = $('<i class=\'plus icon\'></i>');
					child22.append(child221);
					child2.append(child22);
				}
			}

			$('.chapterSelect .chapters').append(child2);
		}
	}
	$('.menu .item').tab();           // 初始化tab
	$( $('.chapterSelect .menu').children('.item')[0] ).addClass('active');
	$( $('.chapterSelect .chapters').children('.tab')[0] ).addClass('active');
	document.getElementById('chapterSelect').scrollIntoView();
}