import React from 'react';
import FeedItem from '../../Common/FeedItem';

function FollowingFeed({ activities, toggleRefresh }) {
    return (
        <div>
            {activities.map((activity, index) => (
                <FeedItem key={index} activity={activity} toggleRefresh = {toggleRefresh}/>
            ))}
        </div>
    );
}

export default FollowingFeed;