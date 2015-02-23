var React   = require('react');
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
			<div className="post cf">
				<div className="post-link">
					// <a className="post-title" href={ post.url }>{ post.title }</a>
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
