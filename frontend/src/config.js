const API_BASE_URL = import.meta.env.PROD
  ? 'https://wordle-fullstack-app.onrender.com/'
  : 'http://localhost:5080';

export default API_BASE_URL;