const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async request(method, endpoint, data = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      throw new Error(error.message || 'API request failed');
    }
  },

  get(endpoint, token) {
    return this.request('GET', endpoint, null, token);
  },

  post(endpoint, data, token) {
    return this.request('POST', endpoint, data, token);
  },

  put(endpoint, data, token) {
    return this.request('PUT', endpoint, data, token);
  },

  patch(endpoint, data, token) {
    return this.request('PATCH', endpoint, data, token);
  },

  delete(endpoint, token) {
    return this.request('DELETE', endpoint, null, token);
  },
};
