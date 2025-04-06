from functools import wraps
import json
from os import environ as env
from werkzeug.exceptions import HTTPException

from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, redirect, render_template, session, url_for, request
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from six.moves.urllib.parse import urlencode
import requests

# Load environment variables
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY", "your-secret-key")  # Replace with a real secret key
CORS(app)

# Auth0 configuration
oauth = OAuth(app)
auth0 = oauth.register(
    'auth0',
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    api_base_url=f"https://{env.get('AUTH0_DOMAIN')}",
    access_token_url=f"https://{env.get('AUTH0_DOMAIN')}/oauth/token",
    authorize_url=f"https://{env.get('AUTH0_DOMAIN')}/authorize",
    client_kwargs={
        'scope': 'openid profile email',
    },
)

# Helper function to verify JWT tokens
def verify_token(token):
    # Format the public key endpoint
    jwks_url = f'https://{env.get("AUTH0_DOMAIN")}/.well-known/jwks.json'
    jwks_client = requests.get(jwks_url).json()
    
    # Use libraries like python-jose or pyjwt to validate the token
    # This is a simplified version for illustration
    try:
        from jose import jwt
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        
        for key in jwks_client['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        
        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=['RS256'],
                audience=env.get('AUTH0_API_AUDIENCE'),
                issuer=f'https://{env.get("AUTH0_DOMAIN")}/'
            )
            return payload
        
        return None
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        return None

# Decorator for secured routes
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'message': 'Missing token'}), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'message': 'Invalid token'}), 401
            
        return f(*args, **kwargs)
    return decorated

# Login route
@app.route('/login')
def login():
    return auth0.authorize_redirect(
        redirect_uri=url_for('callback', _external=True),
        audience=env.get('AUTH0_API_AUDIENCE')
    )

# Callback route
@app.route('/callback')
def callback():
    auth0.authorize_access_token()
    resp = auth0.get('userinfo')
    userinfo = resp.json()
    
    # Store user info in session
    session['jwt_payload'] = userinfo
    session['profile'] = {
        'user_id': userinfo['sub'],
        'name': userinfo.get('name', ''),
        'picture': userinfo.get('picture', '')
    }
    
    return redirect('/dashboard')

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    params = {
        'returnTo': url_for('home', _external=True),
        'client_id': env.get('AUTH0_CLIENT_ID')
    }
    return redirect(auth0.api_base_url + '/v2/logout?' + urlencode(params))

# Protected API endpoint
@app.route('/api/private')
@requires_auth
def private():
    return jsonify({
        'message': 'This is a private API endpoint!',
    })

# Public API endpoint
@app.route('/api/public')
def public():
    return jsonify({
        'message': 'This is a public API endpoint!'
    })

# User info endpoint
@app.route('/api/profile')
@requires_auth
def profile():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    payload = verify_token(token)
    if not payload:
        return jsonify({'message': 'Invalid token'}), 401
    
    # Fetch user info from Auth0
    userinfo_url = f'https://{env.get("AUTH0_DOMAIN")}/userinfo'
    response = requests.get(
        userinfo_url,
        headers={'Authorization': f'Bearer {token}'}
    )
    
    if response.status_code != 200:
        return jsonify({'message': 'Failed to fetch user info'}), 400
    
    return jsonify(response.json())

@app.route('/')
def home():
    return jsonify({
        'message': 'Flask API is running'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=env.get('PORT', 5000))