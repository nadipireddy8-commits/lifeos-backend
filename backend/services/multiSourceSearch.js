const axios = require('axios');

// YouTube search (free)
async function searchYouTube(query, maxResults = 5) {
  if (!process.env.YOUTUBE_API_KEY) return [];
  try {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const response = await axios.get(url, {
      params: {
        part: 'snippet',
        q: `${query} tutorial course`,
        maxResults,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY
      }
    });
    return response.data.items.map(item => ({
      title: item.snippet.title,
      platform: 'YouTube',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
      duration: null,
      free: true
    }));
  } catch (err) {
    console.error('YouTube search error:', err.message);
    return [];
  }
}

// Generic web search via SerpAPI (optional)
async function searchWeb(query, maxResults = 3) {
  if (!process.env.SERPAPI_KEY) return [];
  try {
    const url = `https://serpapi.com/search.json`;
    const response = await axios.get(url, {
      params: {
        q: `${query} course online free`,
        api_key: process.env.SERPAPI_KEY,
        num: maxResults
      }
    });
    const results = response.data.organic_results || [];
    return results.map(r => ({
      title: r.title,
      platform: 'Web',
      url: r.link,
      snippet: r.snippet,
      free: true
    }));
  } catch (err) {
    console.error('Web search error:', err.message);
    return [];
  }
}

// Mock Coursera/Udemy results (since their APIs are restricted)
function getMockOtherPlatforms(query) {
  return [
    {
      title: `${query} - Free Course (Coursera)`,
      platform: 'Coursera',
      url: `https://www.coursera.org/search?query=${encodeURIComponent(query)}`,
      description: 'Check Coursera for free audit tracks',
      free: true
    },
    {
      title: `${query} - Udemy Course`,
      platform: 'Udemy',
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(query)}`,
      description: 'Often discounted, look for free previews',
      free: false
    },
    {
      title: `${query} - edX Course`,
      platform: 'edX',
      url: `https://www.edx.org/search?q=${encodeURIComponent(query)}`,
      description: 'Free to audit, paid certificate',
      free: true
    }
  ];
}

// Rank results based on user's implicit preferences (e.g., free, certificate, quick)
function rankResults(results, preferences) {
  // preferences: { freeOnly: boolean, certificate: boolean, quick: boolean }
  return results.sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    if (preferences.freeOnly) {
      if (a.free) scoreA += 10;
      if (b.free) scoreB += 10;
    }
    if (preferences.certificate && a.platform === 'Coursera') scoreA += 5;
    if (preferences.quick && a.platform === 'YouTube') scoreA += 8;
    return scoreB - scoreA;
  });
}

// backend/services/multiSourceSearch.js
// No API keys required – works immediately

async function searchAllPlatforms(query, userIntent = {}) {
  // Return direct search links to popular learning platforms
  const searchLinks = [
    {
      title: `🔍 Search YouTube for "${query}"`,
      platform: 'YouTube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' tutorial')}`,
      free: true,
      isSearchLink: true
    },
    {
      title: `📚 Search Coursera for "${query}"`,
      platform: 'Coursera',
      url: `https://www.coursera.org/search?query=${encodeURIComponent(query)}`,
      free: true,
      isSearchLink: true
    },
    {
      title: `🎓 Search Udemy for "${query}"`,
      platform: 'Udemy',
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(query)}`,
      free: false,
      isSearchLink: true
    },
    {
      title: `📖 Search edX for "${query}"`,
      platform: 'edX',
      url: `https://www.edx.org/search?q=${encodeURIComponent(query)}`,
      free: true,
      isSearchLink: true
    },
    {
      title: `💻 Search FreeCodeCamp resources`,
      platform: 'FreeCodeCamp',
      url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(query)}`,
      free: true,
      isSearchLink: true
    }
  ];

  // Prioritize based on user preferences
  if (userIntent.freeOnly) {
    return searchLinks.filter(link => link.free);
  }
  if (userIntent.quick) {
    // Move YouTube to top
    const youtube = searchLinks.find(l => l.platform === 'YouTube');
    const others = searchLinks.filter(l => l.platform !== 'YouTube');
    return [youtube, ...others];
  }
  if (userIntent.certificate) {
    // Move Coursera/edX to top
    const certPlatforms = searchLinks.filter(l => l.platform === 'Coursera' || l.platform === 'edX');
    const others = searchLinks.filter(l => l.platform !== 'Coursera' && l.platform !== 'edX');
    return [...certPlatforms, ...others];
  }
  
  return searchLinks;
}

module.exports = { searchAllPlatforms };