# The Muse Job Search Application

A modern web application that fetches job listings from The Muse API and provides an intuitive interface for searching jobs by company, role, location, and publication date.

## Features

- 🔍 **Advanced Search**: Search jobs by company, role/category, location, and publication date
- 🎨 **Modern UI**: Beautiful, responsive interface with Bootstrap 5
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- ⚡ **Real-time Search**: Instant results with loading states and error handling
- 🔗 **Direct Apply Links**: Direct links to job applications
- 📄 **Pagination**: Navigate through multiple pages of results
- 🏢 **Company Focus**: Pre-configured to search for Terratern jobs

## Setup Instructions

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

### GET /api/jobs
Fetches job listings from The Muse API with optional filters.

**Query Parameters:**
- `company` (string): Company name to search for (default: "Terratern")
- `role` (string): Job role or category
- `country` (string): Location to search in
- `published_after` (date): Filter jobs published after this date (YYYY-MM-DD)
- `page` (integer): Page number for pagination (default: 1)

**Example:**
```
GET /api/jobs?company=Terratern&role=Software Engineer&country=Remote&page=1
```

### GET /api/companies
Returns a list of all available companies from The Muse API.

### GET /api/categories
Returns a list of all available job categories from The Muse API.

## Usage

1. **Default Search**: The application automatically loads Terratern jobs when you first visit
2. **Custom Search**: Use the search form to filter jobs by:
   - **Company**: Enter any company name
   - **Role/Category**: Specify job roles like "Software Engineer", "Data Scientist", etc.
   - **Location**: Enter cities, states, or "Remote"
   - **Published After**: Select a date to see only recent postings

3. **View Results**: Each job card displays:
   - Job title and company
   - Location and job type
   - Experience level and categories
   - Publication date
   - Direct apply link

4. **Navigation**: Use pagination controls to browse through multiple pages of results

## Configuration

The application uses The Muse API with the following configuration:
- **API Key**: Pre-configured with Terratern's API key
- **Base URL**: `https://www.themuse.com/api/public/v2`
- **Default Company**: "Terratern"

## Technical Details

### Backend (Flask)
- **Framework**: Flask with CORS support
- **API Integration**: Direct integration with The Muse API
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Processing**: Job data formatting and filtering

### Frontend (HTML/CSS/JavaScript)
- **Styling**: Bootstrap 5 with custom CSS
- **Icons**: Font Awesome 6
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Real-time search, loading states, pagination

### Security Features
- **Input Sanitization**: All user inputs are properly escaped
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Handling**: Secure error messages without sensitive information

## Troubleshooting

### Common Issues

1. **"API request failed" error**:
   - Check your internet connection
   - Verify The Muse API is accessible
   - Ensure the API key is valid

2. **No jobs found**:
   - Try broader search criteria
   - Check if the company name is spelled correctly
   - Try removing some filters

3. **Application won't start**:
   - Ensure Python 3.7+ is installed
   - Install all dependencies: `pip install -r requirements.txt`
   - Check if port 5000 is available

### Getting Help

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the terminal/command prompt for Python errors
3. Verify all dependencies are installed correctly
4. Ensure The Muse API is accessible from your network

## License

This project is created for Terratern's job search needs using The Muse API.
