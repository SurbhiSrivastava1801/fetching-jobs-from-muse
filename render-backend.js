// Simple Express server for The Muse API proxy
// Deploy this to Render.com or similar service

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// The Muse API configuration
const MUSE_API_KEY = '2e0be6ef1ae62b88638d4275e2f39ec4c8ecdbd16c42809d11e49486beea95aa';
const MUSE_BASE_URL = 'https://www.themuse.com/api/public';

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Terratern Job Portal API Proxy',
        status: 'running',
        endpoints: ['/api/jobs', '/api/companies', '/api/categories']
    });
});

// Jobs endpoint
app.get('/api/jobs', async (req, res) => {
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
        
        res.json({
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
});

// Companies endpoint
app.get('/api/companies', async (req, res) => {
    try {
        const { page, search } = req.query;
        
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (search) params.append('search', search);
        
        const apiUrl = `${MUSE_BASE_URL}/companies?${params.toString()}`;
        
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
        const companies = data.results?.map(company => company.name) || [];
        
        res.json({
            success: true,
            companies: companies,
            total_count: data.page_count || 0
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
    try {
        const apiUrl = `${MUSE_BASE_URL}/categories`;
        
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
        const categories = data.results?.map(category => category.name) || [];
        
        res.json({
            success: true,
            categories: categories
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Terratern Job Portal API running on port ${PORT}`);
});
