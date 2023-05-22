import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import '../styles/Main.css';

const Main = () => {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    fetch('/highlights')
      .then((res) => res.json())
      .then((data) => setHighlights(data));
  }, []);

  // Custom YouTube player options
  const youtubePlayerOptions = {
    playerVars: {
        autoplay: 0, // Autoplay the video (0 or 1)
        controls: 1, // Show video controls (0 or 1)
        modestbranding: 1, // Hide YouTube logo (0 or 1)
        showinfo: 1, // Hide video title and other info (0 or 1)
        rel: 1, // Hide related videos at the end (0 or 1)
        loop: 0, // Loop the video playback (0 or 1)
        fs: 0,
        playsinline: 0, // Play the video inline on mobile devices (0 or 1)
       
    },
  };

  return (
    <div className="Main">
      {highlights.map((highlight) => (
        <div className="highlight" key={highlight.id}>
          <p>{highlight.user.name}</p>
          <h1>{highlight.title}</h1>
          <h2>{highlight.description}</h2>
          <h3>Game: {highlight.game.title}</h3>
          <div className="video-player">
            <ReactPlayer
              url={highlight.video_url}
              controls
              width="100%"
              height="100%"
              className="react-player"
              config={{
                youtube: youtubePlayerOptions,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Main;