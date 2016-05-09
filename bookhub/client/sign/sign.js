if (Meteor.isClient) {
	Template.sign.onRendered(function() {
		$('.ui.radio.checkbox').checkbox();
		$('.ui.teal.labeled.icon.button, .ui.teal.button.back').click(function() {
			$('.ui.signup').toggleClass('hidden');
			$('.ui.signin').toggleClass('hidden');
		})
	});

	Template.sign.events({
		'submit .signup .form': function(e) {
			e.preventDefault();
			options = {
				username: e.target.username.value,
				password: e.target.password.value,
				profile: {
					pseudonym: e.target.pseudonym.value,
					introduction: e.target.introduction.value,
					gender: e.target.gender.value,
					fork: []
				}
			}
			Accounts.createUser(options, function(err) {
				if (err) {
					$('.signup .form').addClass('error');
				} else {
					$('.signup .form').removeClass('error');
					Meteor.loginWithPassword(options.username, options.password);
					Router.go('home');
				}
			});
		},
		'submit .signin .form': function(e) {
			e.preventDefault();
			Meteor.loginWithPassword(e.target.username.value, e.target.password.value, function(err) {
				if (err) {
					$('.signin .form').addClass('error');
				} else {
					$('.signin .form').removeClass('error');
					Router.go('home');
				}
			});
		}
	});

}