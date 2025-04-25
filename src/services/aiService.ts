
import React from 'react';

// API key will be hardcoded here - replace the placeholder with your actual key
const API_KEY = "AIzaSyBG88Dc6spqDia9kseXyitK91ht2cQtNZI";

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Function to clean up HTML tags and convert to Markdown
const cleanupResponse = (text: string): string => {
  // Remove HTML tags
  const cleanedText = text
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?\w+[^>]*>/g, '');

  return cleanedText;
};

export async function queryLoungeInfo(prompt: string): Promise<string> {
  try {
    console.log("Querying with prompt:", prompt);
    console.log("Using API key:", API_KEY ? "API key is set" : "API key is missing");
    
    // Construct a more focused prompt that only addresses what was specifically asked
    const finalPrompt = `You are an aiport lounge assistant. Only respond to airport lounge releted queries if found any other respond that you cannot do it as you are just an airport lounge assistant
    Provide focused information about airport lounges based on this query: "${prompt}".

Keep your response directly relevant to the query.


Format the response in well-structured Markdown with proper headings, bullet points, and bold text. Avoid using HTML tags.

After providing the specific information requested, add a section titled "Related Questions" with 3-4 follow-up questions that cover information you didn't include, such as:
1. Terminal locations of lounges
2. Hours of operation
3. Specific amenities
4. Access requirements
5. Alternative lounges

Format these as a numbered list.`;
    
    // Call the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: finalPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    const data = await response.json();
    
    // Check if there's an error
    if (data.error) {
      console.error("API error:", data.error);
      return `Error fetching lounge information: ${data.error.message}`;
    }
    
    // Extract the text from the response and clean it up
    try {
      const responseText = data.candidates[0].content.parts[0].text;
      return cleanupResponse(responseText);
    } catch (e) {
      console.error("Error parsing API response:", e);
      console.log("Full API response:", JSON.stringify(data));
      return "Sorry, I couldn't retrieve information about lounges at this airport. Please try again with a different airport name.";
    }
  } catch (error) {
    console.error("Error querying AI service:", error);
    return "I'm sorry, I encountered an issue while retrieving lounge information. Please try again later.";
  }
}
