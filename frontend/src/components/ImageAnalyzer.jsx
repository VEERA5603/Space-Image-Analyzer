// File: frontend/src/components/ImageAnalyzer.jsx
import { useState } from 'react';

function ImageAnalyzer({ spaceData }) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  
  // Handle media type (image or video)
  const isVideo = spaceData.media_type === 'video';
  
  return (
    <div className="image-analyzer">
      <h2>{spaceData.title}</h2>
      <p className="date">{spaceData.date}</p>
      
      <div className="media-container">
        {isVideo ? (
          <div className="video-container">
            <iframe
              src={spaceData.url}
              title={spaceData.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img 
            src={spaceData.url} 
            alt={spaceData.title} 
            className="space-image" 
          />
        )}
      </div>
      
      <div className="explanation">
        <h3>NASA's Explanation</h3>
        <p>{spaceData.explanation}</p>
      </div>
      
      <div className="analysis">
        <h3>AI Analysis</h3>
        {isVideo ? (
          <p>{spaceData.analysis}</p>
        ) : (
          <>
            <p>
              {showFullAnalysis 
                ? spaceData.analysis 
                : `${spaceData.analysis.substring(0, 300)}...`}
            </p>
            <button 
              className="toggle-analysis"
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            >
              {showFullAnalysis ? 'Show Less' : 'Show Full Analysis'}
            </button>
          </>
        )}
      </div>
      
      {spaceData.copyright && (
        <div className="copyright">
          <p>© {spaceData.copyright}</p>
        </div>
      )}
    </div>
  );
}

export default ImageAnalyzer;
