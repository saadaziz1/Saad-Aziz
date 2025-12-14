import { useNavigate } from 'react-router-dom';
import { useDashboardAnalytics } from '../../hooks/useDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600">Error loading dashboard data</p>
      </div>
    );
  }

  const analytics = data?.analytics || {};

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{color: '#282828'}}>Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Manage Products
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Manage Orders
          </button>
        </div>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold" style={{color: '#282828'}}>
            {analytics.totalUsers || 0}
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold" style={{color: '#282828'}}>
            {analytics.totalOrders || 0}
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold" style={{color: '#282828'}}>
            €{analytics.revenue?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Low Stock Products */}
      {analytics.lowStockProducts && analytics.lowStockProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{color: '#282828'}}>Low Stock Products</h2>
          <div className="bg-gray-50 rounded border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Variant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.lowStockProducts.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm" style={{color: '#282828'}}>
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{color: '#282828'}}>
                      {item.variants?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">
                      {item.variants?.stock || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Selling Products */}
      {analytics.topSellingProducts && analytics.topSellingProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4" style={{color: '#282828'}}>Top Selling Products</h2>
          <div className="bg-gray-50 rounded border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topSellingProducts.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm" style={{color: '#282828'}}>
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{color: '#282828'}}>
                      {item.totalSold || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

