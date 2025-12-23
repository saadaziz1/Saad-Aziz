import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/watch/${video._id}`}>
        <div className="video-card-image">
          <img src={video.thumbnail} alt={video.title} />
          {video.isPremium && <span className="premium-badge">Premium</span>}
        </div>
        <div className="video-card-content">
          <h3>{video.title}</h3>
          <p className="video-genre">{video.genre}</p>
          <p className="video-year">{video.releaseYear}</p>
          <p className="video-duration">{video.duration} min</p>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;