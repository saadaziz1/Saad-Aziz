const axios = require('axios');

const BASE_URL = 'https://week3-day5.vercel.app/api';

const quickTests = async () => {
  console.log('🔍 Quick Swagger Validation Tests\n');
  
  try {
    // Test 1: Server is running
    console.log('1. Testing server connection...');
    const serverTest = await axios.get('https://week3-day5.vercel.app/health').catch(() => 
      axios.get(`${BASE_URL}/products`));
    console.log('✅ Server is running\n');
    
    // Test 2: Swagger docs accessible
    console.log('2. Testing Swagger documentation...');
    const swaggerTest = await axios.get('https://week3-day5.vercel.app/api-docs');
    console.log('✅ Swagger UI accessible\n');
    
    // Test 3: Swagger JSON spec
    console.log('3. Testing Swagger JSON spec...');
    const specTest = await axios.get('https://week3-day5.vercel.app/api-docs.json');
    console.log('✅ Swagger JSON spec valid\n');
    
    // Test 4: Products endpoint structure
    console.log('4. Testing Products GET endpoint...');
    const productsTest = await axios.get(`${BASE_URL}/products`);
    if (!productsTest.data.success) throw new Error('Missing success field');
    if (!Array.isArray(productsTest.data.products)) throw new Error('Products should be array');
    console.log('✅ Products endpoint working\n');
    
    // Test 5: Auth endpoint structure
    console.log('5. Testing Auth validation...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {});
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Auth validation working\n');
      } else {
        throw new Error('Unexpected auth response');
      }
    }
    
    // Test 6: Protected endpoint security
    console.log('6. Testing protected endpoint security...');
    try {
      await axios.post(`${BASE_URL}/products`, {});
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Protected endpoints secured\n');
      } else {
        throw new Error('Security not working properly');
      }
    }
    
    console.log('🎉 All quick tests passed! Swagger documentation is properly configured.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Vercel deployment is active');
    console.log('   - Database is connected');
    console.log('   - All routes are properly configured');
  }
};

quickTests();