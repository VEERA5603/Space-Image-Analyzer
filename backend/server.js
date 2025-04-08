const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// NASA APOD API endpoint
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = process.env.NASA_API_KEY;

// Initialize Gemini API once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route to fetch APOD and analyze it
app.get('/api/space-image', async (req, res) => {
  try {
    // Get date from query parameter or use today's date
    const today = new Date();
    const date = req.query.date || today.toISOString().split('T')[0];
    
    // Validate date is not in the future
    const requestedDate = new Date(date);
    if (requestedDate > today) {
      return res.status(400).json({ error: "Cannot request future dates" });
    }

    // Fetch APOD from NASA API with timeout
    const nasaResponse = await axios.get(NASA_API_URL, {
      params: {
        api_key: NASA_API_KEY,
        date: date
      },
      timeout: 10000 // 10 second timeout
    });
    
    const apodData = nasaResponse.data;
    
    // Skip AI analysis for videos
    if (apodData.media_type === 'video') {
      return res.json({
        ...apodData,
        analysis: "This is a video. AI image analysis is only available for images."
      });
    }
    
    // Create prompt for astronomical analysis
    const prompt = `This is NASA's Astronomy Picture of the Day titled "${apodData.title}". 
    Please analyze this astronomical image and provide:
    1. A detailed identification of celestial objects visible in the image
    2. Scientific explanations of key features
    3. Interesting facts about what we're seeing
    4. Context about why this image is scientifically significant`;

    // Convert image URL to data that Gemini can process
    const imageData = await fetchImageAsBase64(apodData.url);

    // Generate content with Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData
              }
            }
          ]
        }
      ]
    });

    const analysis = (await result.response).text();
    
    // Return both NASA APOD data and AI analysis
    res.json({
      ...apodData,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('Error:', error);
    if (error.code === 'ETIMEDOUT') {
      res.status(504).json({ error: 'Connection to NASA API timed out' });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch and analyze space image',
        details: error.message 
      });
    }
  }
});

// Helper function to fetch image as base64 with error handling
async function fetchImageAsBase64(url) {
  try {
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 10000 
    });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
