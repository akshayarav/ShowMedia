import React from 'react';
import FeedItem from '../../Profile/Feed/FeedItem';

function FollowingFeed({ activities }) {
    return (
        <div>
            {activities.map((activity, index) => (
                <FeedItem key={index} activity={activity} />
            ))}
        </div>
    );
}

export default FollowingFeed;