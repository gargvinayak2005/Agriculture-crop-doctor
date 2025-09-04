const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testAPI() {
    console.log('Testing API endpoints...\n');

    try {
        // Test root endpoint
        console.log('1. Testing root endpoint...');
        const rootResponse = await axios.get(BASE_URL);
        console.log('✓ Root endpoint working:', rootResponse.data);

        // Test debug endpoint
        console.log('\n2. Testing debug endpoint...');
        const debugResponse = await axios.get(`${BASE_URL}/api/debug`);
        console.log('✓ Debug endpoint working:', debugResponse.data);

        // Test auth register endpoint
        console.log('\n3. Testing auth register endpoint...');
        const registerData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword123',
            phone: '1234567890',
            location: 'Test City',
            farmSize: '10 acres',
            cropTypes: 'Wheat, Rice'
        };

        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
            console.log('✓ Register endpoint working:', registerResponse.data);
        } catch (error) {
            console.log('Register endpoint response:', error.response?.data || error.message);
        }

        // Test auth login endpoint
        console.log('\n4. Testing auth login endpoint...');
        const loginData = {
            email: 'test@example.com',
            password: 'testpassword123'
        };

        try {
            const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
            console.log('✓ Login endpoint working:', loginResponse.data);
        } catch (error) {
            console.log('Login endpoint response:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('API test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n❌ Server is not running. Please start the server first.');
        }
    }
}

testAPI();
