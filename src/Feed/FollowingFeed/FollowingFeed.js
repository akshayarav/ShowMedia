import React from 'react';
import FeedItem from '../../Profile/Feed/FeedItem';

function FollowingFeed({ activities }) {
    return (
        <div>
            {activities.length > 0 ? (
                activities.map((activity, index) => (
                    <FeedItem key={index} activity={activity} />
                ))
            ) : (
                <p>No activities in following feed.</p>
            )}
        </div>
    );
}

export default FollowingFeed;