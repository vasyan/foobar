var React   = require('react/addons');
var actions = require('../actions/actions');
var Link    = require('react-router').Link;

var anonUser = {
	photo_big: 'http://vk.com/images/deactivated_200.gif',
	'first_name': 'Anon'
};

var Post = React.createClass({

	mixins: [
		require('../mixins/pluralize'),
		require('../mixins/abbreviateNumber'),
		require('../mixins/hostNameFromUrl'),
		require('../mixins/timeAgo')
	],

	render: function() {
		var post = this.props.post,
			user = this.props.user || anonUser,
			userAge = this.timeAgo(post.b)

		if ( this.props.filterBy !== 'All' && user.sex !== this.props.filterBy ) return null;

		return (
			<div className="post-item-container row">
				{/*<div className="post-link">
					<a className="post-title" href={ post.url }>{ post.title }</a>
				</div>*/}
				<div className="three columns profile-photo-container">
					<img className="profile-photo u-full-width" src={ user.photo_big } alt="photo"/>
					<a href="#" className="button u-full-width">Profile</a>
					<a href="#" className="button u-full-width">Post</a>
				</div>
				<div className="post-text-section nine columns">
					<a href={ "https://vk.com/id" + post.signer_id }>{ user['first_name'] }</a>
						<p dangerouslySetInnerHTML={{ __html: post.text }}></p>
						{ post.attachment && post.attachment.photo ?
							<img className="attachment-photo u-max-full-width" src={ post.attachment.photo.src_big }/>
							: '' }
						<span className="post-info-time-ago">
							{ this.timeAgo(post.date * 1000) }
						</span>
						<span className="post-info-item">
						</span>
				</div>
			</div>
		);
	}

});

module.exports = Post;
