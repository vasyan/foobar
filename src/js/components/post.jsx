var React   = require('react/addons');
var actions = require('../actions/actions');
var Link    = require('react-router').Link;

var Post = React.createClass({

	mixins: [
		require('../mixins/pluralize'),
		require('../mixins/abbreviateNumber'),
		require('../mixins/hostNameFromUrl'),
		require('../mixins/timeAgo')
	],

	render: function() {
		var post = this.props.post;

		return (
			<div className="post-item-container row">
				{/*<div className="post-link">
					<a className="post-title" href={ post.url }>{ post.title }</a>
				</div>*/}
				<div className="three columns profile-photo-container">
					<img className="profile-photo u-full-width" src="http://lorempixel.com/g/205/200/people/" alt="photo"/>
					<a href="#" className="button u-full-width">Profile</a>
					<a href="#" className="button u-full-width">Post</a>
				</div>
				<div className="post-info">
					<div className="posted-by">
						<span className="post-info-item">
						</span>
						<p>{ post.text } </p>
						<span className="post-info-item">
							{ this.timeAgo(post.date) }
						</span>
						<span className="post-info-item">
						</span>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = Post;
