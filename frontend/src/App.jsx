import { useState, useEffect } from 'react';
import './App.css';
import ImageAnalyzer from './components/ImageAnalyzer';
import DatePicker from './components/DatePicker';

function App() {
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSpaceImage(selectedDate);
  }, [selectedDate]);

  const fetchSpaceImage = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/space-image?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setSpaceData(data);
      setError(null);
    } catch (err) {
      setError('Error fetching space image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Space Image Analyzer</h1>
      </header>
      
      <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
      
      {loading && <div className="loading">Loading space image...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {spaceData && !loading && (
        <ImageAnalyzer spaceData={spaceData} />
      )}
      
      <footer>
        <p>Data provided by NASA's Astronomy Picture of the Day (APOD) API</p>
        <p>Analysis powered by Google's Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;