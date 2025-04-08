import { useState } from 'react';

function ImageAnalyzer({ spaceData }) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  
  // Handle media type (image or video)
  const isVideo = spaceData.media_type === 'video';
  
  // Function to format the AI analysis content
  const renderAnalysisContent = () => {
    if (!spaceData.analysis) return null;
    
    // Get the content to display (full or truncated)
    const content = showFullAnalysis 
      ? spaceData.analysis 
      : `${spaceData.analysis.substring(0, 300)}...`;
    
    // Format the content with better structure if showing full analysis
    if (showFullAnalysis) {
      // Try to split by numbered points (1., 2., etc.)
      const sections = content.split(/\n(?=\d+[\.\)]\s)/g);
      
      if (sections.length > 1) {
        return (
          <>
            {sections.map((section, index) => {
              // Check if this section starts with a number
              const match = section.match(/^(\d+[\.\)]\s)(.+?)(?:\n|$)/);
              
              if (match) {
                const [, number, title] = match;
                const sectionContent = section.substring(match[0].length);
                
                return (
                  <div key={index} className="analysis-section">
                    <h4>{number}{title}</h4>
                    <p>{sectionContent}</p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="analysis-section">
                    <p>{section}</p>
                  </div>
                );
              }
            })}
          </>
        );
      }
    }
    
    // Default rendering as paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return (
      <>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="analysis-paragraph">{paragraph}</p>
        ))}
      </>
    );
  };
  
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
        <div className="analysis-header">
          <h3>AI Analysis</h3>
          {!isVideo && spaceData.analysis && spaceData.analysis.length > 300 && (
            <button 
              className="toggle-analysis"
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            >
              {showFullAnalysis ? 'Show Less' : 'Show Full Analysis'}
            </button>
          )}
        </div>
        
        <div className="analysis-content">
          {isVideo ? (
            <p>{spaceData.analysis}</p>
          ) : (
            renderAnalysisContent()
          )}
        </div>
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
