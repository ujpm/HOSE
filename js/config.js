const config = {
    API_URL: 'https://hose-backend.vercel.app/api/v1',
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json'
    },
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            ...this.DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
        };
    }
};

export default config;
