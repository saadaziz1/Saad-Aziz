import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApprovedMovies } from '../hooks/useApprovedMovies';
import ApprovedMovieCard from '../components/Cards/ApprovedMovieCard';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { approvedMovies, loading: approvedLoading } = useApprovedMovies();

  const categories = [
    { name: 'Action', count: 24 },
    { name: 'Adventure', count: 18 },
    { name: 'Comedy', count: 32 },
    { name: 'Drama', count: 28 },
    { name: 'Horror', count: 15 }
  ];

  const devices = [
    { name: 'Smartphones', icon: '📱', desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Tablet', icon: '📱', desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Smart TV', icon: '📺', desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Laptops', icon: '💻', desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'Gaming Consoles', icon: '🎮', desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' },
    { name: 'VR Headsets', icon: '🥽', desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store' }
  ];

  const faqs = [
    { q: 'What is StreamVibe?', a: 'StreamVibe is a streaming service that allows you to watch movies and shows on demand.' },
    { q: 'How much does StreamVibe cost?', a: 'We offer various subscription plans starting from $9.99/month.' },
    { q: 'What content is available on StreamVibe?', a: 'We have a vast library of movies, TV shows, documentaries and more.' },
    { q: 'How can I watch StreamVibe?', a: 'You can watch on any internet-connected device that offers the StreamVibe app.' }
  ];

  const plans = [
    { name: 'Basic Plan', price: '$9.99', desc: 'Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.', features: ['Access to wide selection of movies and shows', 'Limited to 720p resolution', 'Watch on 1 device at a time'] },
    { name: 'Standard Plan', price: '$12.99', desc: 'Access to a wider selection of movies and shows, including most new releases and exclusive content', features: ['Access to wider selection of movies and shows', 'Watch in Full HD (1080p)', 'Watch on 2 devices at a time'] },
    { name: 'Premium Plan', price: '$14.99', desc: 'Access to a widest selection of movies and shows, including all new releases and Offline Viewing', features: ['Access to widest selection of movies and shows', 'Watch in Ultra HD (4K) + HDR', 'Watch on 4 devices at a time'] }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-img.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-black/90"></div>
        
        {/* Large Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 md:w-72 md:h-72 hover:scale-105 transition-all cursor-pointer">
            <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M49.7834 24.0839C49.3635 10.9327 38.7071 0.319787 25.5115 0C25.1716 0 24.8917 0.259827 24.8917 0.5996L24.8717 9.43371C24.8717 9.87342 24.5318 10.2132 24.092 10.2332C10.9364 10.6329 0.319893 21.3058 0 34.497C0 34.8368 0.259913 35.1166 0.5998 35.1166L9.41686 35.1366C9.85671 35.1366 10.1966 35.4763 10.2166 35.9161C10.6365 49.0673 21.3129 59.6802 34.4885 60C34.8284 60 35.1083 59.7402 35.1083 59.4004L35.1283 50.5663C35.1283 50.1266 35.4682 49.7868 35.908 49.7668C49.0636 49.3471 59.6801 38.6742 60 25.503C60 25.1632 59.7401 24.8834 59.4002 24.8834L50.5831 24.8634C50.1433 24.8634 49.8034 24.5236 49.7834 24.0839ZM34.2486 49.7069C26.7711 49.2672 20.7731 43.1912 20.4932 35.6762C20.4732 35.3564 20.2133 35.0966 19.8934 35.0966L11.0963 35.0766C10.6365 35.0766 10.2766 34.6969 10.2966 34.2372C10.7364 26.7622 16.8144 20.7662 24.3319 20.4863C24.6518 20.4664 24.9117 20.2065 24.9117 19.8867L24.9317 11.0726C24.9317 10.6129 25.3116 10.2532 25.7714 10.2732C33.2489 10.7129 39.2469 16.7888 39.5268 24.3038C39.5468 24.6236 39.8067 24.8834 40.1266 24.8834L48.9237 24.9034C49.3835 24.9034 49.7434 25.2831 49.7234 25.7428C49.2836 33.4177 42.9057 39.5137 35.1283 39.5137L35.1083 48.9074C35.0883 49.3671 34.7084 49.7268 34.2486 49.7069Z" fill="#E60000"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24.6304 24.6827C24.6304 23.4734 25.927 22.7067 26.9866 23.2895L36.7729 28.672C37.8713 29.2761 37.8713 30.8543 36.7729 31.4584L26.9866 36.8408C25.9269 37.4236 24.6304 36.657 24.6304 35.4477V24.6827Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Best Streaming Experience
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
          </p>
          <Link to={isAuthenticated ? "/browse" : "/signup"} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            Start Watching Now
          </Link>
        </div>
      </div>

      {/* Admin Approved Movies Section */}
      <div className="py-20 bg-darker">
        <div className="container mx-auto px-5">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Movies & Shows</h2>
              <p className="text-gray-400">Handpicked content by our team</p>
            </div>
          </div>
          {approvedLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : approvedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {approvedMovies.slice(0, 12).map((movie) => (
                <ApprovedMovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>No movies available yet. Admin will add content soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-darker">
        <div className="container mx-auto px-5">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Explore our wide variety of categories</h2>
              <p className="text-gray-400">Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new</p>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">←</button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">→</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-primary/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.count} Movies</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices Section */}
      <div className="py-20 bg-dark">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">We Provide you streaming experience across various devices.</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">{device.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{device.name}</h3>
                </div>
                <p className="text-gray-400">{device.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-darker">
        <div className="container mx-auto px-5">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe.</p>
            </div>
            <Link to="#" className="btn btn-primary">Ask a Question</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">{String(index + 1).padStart(2, '0')}</span>
                  <button className="text-2xl">+</button>
                </div>
                <h3 className="font-semibold mb-3">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-dark">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose the plan that's right for you</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!</p>
            <div className="flex justify-center mt-8">
              <div className="bg-gray-800 rounded-lg p-1 flex">
                <button className="px-6 py-2 bg-primary rounded-md text-white">Monthly</button>
                <button className="px-6 py-2 text-gray-400">Yearly</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors">
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.desc}</p>
                <div className="text-3xl font-bold mb-6">{plan.price}<span className="text-lg text-gray-400">/month</span></div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary w-full">Choose Plan</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold mb-4">Start your free trial today!</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">This is a clear and concise call to action that encourages users to sign up for a free trial StreamVibe.</p>
          <Link to="/signup" className="btn btn-primary text-lg px-8 py-4">Start Free Trial</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;