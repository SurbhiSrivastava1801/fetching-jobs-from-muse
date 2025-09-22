from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# The Muse API configuration
MUSE_API_KEY = "2e0be6ef1ae62b88638d4275e2f39ec4c8ecdbd16c42809d11e49486beea95aa"
MUSE_BASE_URL = "https://www.themuse.com/api/public"

@app.route('/')
def index():
    """Serve the main frontend page"""
    return render_template('index.html')

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Fetch jobs from The Muse API with optional filters"""
    try:
        # Get query parameters
        company = request.args.get('company', '')  # No default company - show all jobs
        role = request.args.get('role', '')
        country = request.args.get('country', '')
        published_after = request.args.get('published_after', '')
        page = request.args.get('page', 1)
        
        # Build API URL
        api_url = f"{MUSE_BASE_URL}/jobs"
        params = {
            'page': page,
            'descending': 'true'  # Get latest jobs first
        }
        
        # Add filters if provided
        if company:
            params['company'] = company
        if role:
            params['category'] = role
        if country:
            params['location'] = country
        if published_after:
            params['published'] = published_after
            
        # Make request to The Muse API
        headers = {
            'Content-Type': 'application/json',
            'X-Muse-Api-Key': MUSE_API_KEY
        }
        
        response = requests.get(api_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Process and format the job data
        jobs = []
        for job in data.get('results', []):
            job_info = {
                'id': job.get('id'),
                'title': job.get('name', 'N/A'),
                'company': job.get('company', {}).get('name', 'N/A'),
                'locations': [loc.get('name', 'N/A') for loc in job.get('locations', [])],
                'apply_link': job.get('refs', {}).get('landing_page', ''),
                'publication_date': job.get('publication_date', ''),
                'type': job.get('type', 'N/A'),
                'level': job.get('levels', [{}])[0].get('name', 'N/A') if job.get('levels') else 'N/A',
                'categories': [cat.get('name', '') for cat in job.get('categories', [])]
            }
            jobs.append(job_info)
        
        return jsonify({
            'success': True,
            'jobs': jobs,
            'total_count': data.get('page_count', 0),
            'current_page': int(page)
        })
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'success': False,
            'error': f'API request failed: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/companies', methods=['GET'])
def get_companies():
    """Get list of companies from The Muse API"""
    try:
        page = request.args.get('page', 1)
        search = request.args.get('search', '')
        
        api_url = f"{MUSE_BASE_URL}/companies"
        params = {'page': page}
        
        if search:
            params['search'] = search
            
        headers = {
            'Content-Type': 'application/json',
            'X-Muse-Api-Key': MUSE_API_KEY
        }
        
        response = requests.get(api_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        companies = [company.get('name', '') for company in data.get('results', [])]
        
        return jsonify({
            'success': True,
            'companies': companies,
            'total_count': data.get('page_count', 0)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch companies: {str(e)}'
        }), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get list of job categories from The Muse API"""
    try:
        api_url = f"{MUSE_BASE_URL}/categories"
        headers = {
            'Content-Type': 'application/json',
            'X-Muse-Api-Key': MUSE_API_KEY
        }
        
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        categories = [cat.get('name', '') for cat in data.get('results', [])]
        
        return jsonify({
            'success': True,
            'categories': categories
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch categories: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
