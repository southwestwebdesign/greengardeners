// src/pages/api/getGoogleReviews.js
export async function GET() {
  try {
    // Get API key and place ID from environment variables
    const API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY;
    const PLACE_ID = import.meta.env.GOOGLE_PLACE_ID || 'your-place-id';
    
    if (!API_KEY) {
      return new Response(JSON.stringify({
        error: "Missing Google Places API key"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${PLACE_ID}&key=${API_KEY}&fields=reviews,rating,user_ratings_total`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    const reviews = {
      rating: data.result.rating || 0,
      total: data.result.user_ratings_total || 0,
      reviews: (data.result.reviews || []).map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time * 1000, // Convert to milliseconds
        profilePhoto: review.profile_photo_url,
        relativeTime: review.relative_time_description
      }))
    };
    
    // Return as JSON
    return new Response(JSON.stringify(reviews), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    
    // Return error
    return new Response(JSON.stringify({
      error: error.message || 'Unknown error fetching reviews',
      fallbackData: await getManualReviews()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fallback manual reviews
async function getManualReviews() {
  return {
    rating: 4.9,
    total: 140,
    reviews: [
      {
        author: "John Smith",
        rating: 5,
        text: "The Green Gardeners did a fantastic job replacing our water main. Very professional and tidy work.",
        time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        profilePhoto: "https://ui-avatars.com/api/?name=JS&background=0D8ABC&color=fff",
        relativeTime: "1 week ago"
      },
      {
        author: "Sarah Johnson",
        rating: 5,
        text: "Excellent service. They came quickly when we had an emergency leak and fixed it with minimal disruption.",
        time: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        profilePhoto: "https://ui-avatars.com/api/?name=SJ&background=2E8B57&color=fff",
        relativeTime: "2 weeks ago"
      },
      {
        author: "Michael Thompson",
        rating: 5,
        text: "Great job replacing our lead pipe. The team was professional, fast and left everything clean. Would highly recommend!",
        time: Date.now() - 21 * 24 * 60 * 60 * 1000,
        profilePhoto: "https://ui-avatars.com/api/?name=MT&background=800000&color=fff",
        relativeTime: "3 weeks ago"
      },
      {
        author: "Emma Wilson",
        rating: 4,
        text: "Very pleased with the pipe repair service. They explained everything clearly and completed the job quickly.",
        time: Date.now() - 28 * 24 * 60 * 60 * 1000,
        profilePhoto: "https://ui-avatars.com/api/?name=EW&background=6A5ACD&color=fff",
        relativeTime: "1 month ago"
      }
    ]
  };
}
