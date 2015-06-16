if ( Meteor.isClient ) {
	Template.book.onRendered( function() {
		$('.bookface').mouseover( function() {
			$(this).addClass('animated bounce');
		});
		$('.bookface').mouseleave( function() {
			$(this).removeClass('animated bounce');
		});
		$('.bookface').click( function() {
			Router.go('bookIntro');
		});
	});

	Template.book.helpers({
		latest_novels: function() {
			return Novel.find({}, { sort: {createAt: -1}, limit: 8 });
		},
		hot_novels: function() {
			return Novel.find({}, { sort: {pv: 1}, limit: 8 });
		},
		all_latest_novels: function() {
			return Novel.find({}, { sort: {createAt: -1} });
		},
		all_hot_novels: function() {
			return Novel.find({}, { sort: {pv: 1} });
		}
	});

	Template.book.events({
		'click .hot_novel_left': function() {
			switchSlider($('.temp_hot_novel'), $('.hot_novel'), 'left');
		},
		'click .hot_novel_right': function() {
			switchSlider($('.temp_hot_novel'), $('.hot_novel'), 'right');
		},
		'click .latest_novel_left': function() {
			switchSlider($('.temp_latest_novel'), $('.latest_novel'), 'left');
		},
		'click .latest_novel_right': function() {
			switchSlider($('.temp_latest_novel'), $('.latest_novel'), 'right');
		}
	})
}

function switchSlider(temp, all_novels, direction) {
	temp.each(function() {
		$(this).remove();
	});

	var novels = [];
	var index = -1;
	var found = false;

	all_novels.each(function() {
		novels.push($(this));
	});

	for (var i = 0; i < novels.length; i++) {
		if (!novels[i].hasClass('hidden')) {
			novels[i].addClass('hidden');
			if (!found) {
				if (direction == 'right') {
					index = (i + 8 > novels.length) ? 0 : (i + 8);
				} else if (direction == 'left') {
					index = (i - 8 < 0) ? (novels.length - novels.length % 8) : (i - 8);
				}
				found = true;
			}
		}
	}

	if (!found) {
		index = (direction == 'right') ? 8 : (novels.length - novels.length % 8);
	}

	for (var i = index; i < index + 8 && i < novels.length; i++) {
		novels[i].removeClass('hidden');
	}
}
