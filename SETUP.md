# OMDB Movie Search - Setup Guide

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A free API key from OMDB API

## Getting Your API Key

1. Visit [OMDB API](http://www.omdbapi.com/) website
2. Click on "API Key (Free!)" in the navigation
3. Fill out the registration form with your email
4. Check your email and click the verification link
5. You'll receive your free API key (max 1000 requests per day)

## Installation & Setup

### Step 1: Clone or Create Your Repository

Use this template to create your own repository on GitHub:
- Click "Use this template" button on the original repository
- Name your repository `omdb-project`
- Make it public

### Step 2: Add Your API Key

1. Open `script.js` file in your text editor
2. Find line 12: `this.API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   this.API_KEY = 'your_actual_api_key_here';
   ```
4. Save the file

### Step 3: Test Locally

1. Open `index.html` in your web browser
2. Try searching for a movie (e.g., "The Matrix")
3. If it works, you're ready to deploy!

## Deploying to GitHub Pages

### Option 1: Using GitHub Web Interface

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Your site will be available at `https://yourusername.github.io/omdb-project`

### Option 2: Using Git Command Line

```bash
# Clone your repository
git clone https://github.com/yourusername/omdb-project.git
cd omdb-project

# Add and commit files
git add .
git commit -m "Initial commit: OMDB Movie Search application"

# Push to GitHub
git push origin main
```

Then follow Option 1 to enable GitHub Pages.

## Verification

After deployment:
1. Visit your GitHub Pages URL
2. Search for a movie to verify it's working
3. Check the browser console (F12 > Console) for any errors

## Troubleshooting

### API returns "403 Forbidden"
- Your API key may be incorrect
- Check if you've exceeded your daily request limit (1000/day)

### No movies found in search
- Verify your API key is correctly added to `script.js`
- Check the browser console for error messages
- Ensure the movie name is spelled correctly

### Poster images not loading
- The OMDB API has limited poster availability
- Some movies may not have poster images in the database

### CORS errors
- This is normal - the OMDB API handles cross-origin requests
- The proxy should work automatically

## Features Implemented

✅ Movie search functionality
✅ Display movie details (title, year, genre, director, actors, plot, runtime, rating)
✅ Error handling for API failures
✅ Multiple search results with clickable cards
✅ Fully responsive design (mobile, tablet, desktop)
✅ LocalStorage to remember last search
✅ Loading states and animations
✅ Modern UI with smooth transitions

## File Structure

```
omdb-project/
├── index.html      # Main HTML file with structure
├── styles.css      # Responsive styling
├── script.js       # JavaScript logic and API integration
├── .gitignore      # Git ignore rules
├── SETUP.md        # This setup guide
└── README.md       # Project documentation
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Uses async/await for clean asynchronous code
- Implements error boundaries for graceful failure handling
- Lazy loading for images in search results
- CSS animations for smooth user experience
- Efficient DOM updates

## Security Considerations

- API key is exposed in client-side code (acceptable for free tier with rate limits)
- For production apps with sensitive operations, use a backend proxy
- No sensitive user data is stored or transmitted

## Next Steps for Enhancement

1. **Backend Proxy**: Create a Node.js/Express server to hide API key
2. **Advanced Filtering**: Add year, type, and plot filters
3. **Favorites System**: Save favorite movies to LocalStorage
4. **Search History**: Maintain a list of previous searches
5. **Movie Recommendations**: Suggest similar movies
6. **Dark Mode**: Add theme toggle
7. **PWA Support**: Make it work offline
8. **Deployment**: Deploy to Vercel or Netlify for better performance

## Support & Resources

- [OMDB API Documentation](http://www.omdbapi.com/)
- [GitHub Pages Guide](https://pages.github.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Good luck with your project! 🎬**
