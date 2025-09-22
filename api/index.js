// Vercel serverless function for The Muse API proxy
const fetch = require('node-fetch');

// The Muse API configuration
const MUSE_API_KEY = '2e0be6ef1ae62b88638d4275e2f39ec4c8ecdbd16c42809d11e49486beea95aa';
const MUSE_BASE_URL = 'https://www.themuse.com/api/public';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Muse-Api-Key');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const { company, role, country, published_after, page } = req.query;
        
        // Build API URL
        const params = new URLSearchParams();
        if (company) params.append('company', company);
        if (role) params.append('category', role);
        if (country) params.append('location', country);
        if (published_after) params.append('published', published_after);
        if (page) params.append('page', page);
        
        params.append('descending', 'true');
        
        const apiUrl = `${MUSE_BASE_URL}/jobs?${params.toString()}`;
        
        // Make request to The Muse API
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'X-Muse-Api-Key': MUSE_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process and format the job data
        const jobs = data.results?.map(job => ({
            id: job.id,
            title: job.name || 'N/A',
            company: job.company?.name || 'N/A',
            locations: job.locations?.map(loc => loc.name) || [],
            apply_link: job.refs?.landing_page || '',
            publication_date: job.publication_date || '',
            type: job.type || 'N/A',
            level: job.levels?.[0]?.name || 'N/A',
            categories: job.categories?.map(cat => cat.name) || []
        })) || [];
        
        res.status(200).json({
            success: true,
            jobs: jobs,
            total_count: data.page_count || 0,
            current_page: parseInt(page) || 1
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
