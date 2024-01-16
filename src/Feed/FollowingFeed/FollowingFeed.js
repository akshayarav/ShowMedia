import React from 'react';
import FeedItem from '../../Common/FeedItem';

function FollowingFeed({ activities, refresh, toggleRefresh  }) {
    return (
        <div>
            {activities.map((activity, index) => (
                <FeedItem key={index} activity={activity} refresh={refresh} toggleRefresh={toggleRefresh}/>
            ))}
        </div>
    );
}

export default FollowingFeed;