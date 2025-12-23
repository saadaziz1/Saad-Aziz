import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

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
            <svg width="100%" height="100%" viewBox="0 0 470 470" fill="none" xmlns="http://www.w3.org/2000/svg">
              <foreignObject x="-12" y="-12" width="494" height="494">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{backdropFilter:'blur(6px)', clipPath:'url(#bgblur_0_1_62_clip_path)', height:'100%', width:'100%'}}></div>
              </foreignObject>
              <g data-figma-bg-blur-radius="12">
                <path d="M389.97 188.658C386.681 85.6396 303.206 2.505 199.84 0C197.178 0 194.985 2.03531 194.985 4.69687L194.828 73.8974C194.828 77.3418 192.166 80.0033 188.72 80.1599C85.6681 83.2911 2.50583 166.895 0 270.227C0 272.888 2.03599 275.08 4.69843 275.08L73.7654 275.236C77.2109 275.236 79.8734 277.898 80.03 281.342C83.3189 384.36 166.951 467.495 270.16 470C272.822 470 275.015 467.965 275.015 465.303L275.172 396.103C275.172 392.658 277.834 389.997 281.28 389.84C384.332 386.552 467.494 302.948 470 199.773C470 197.112 467.964 194.92 465.302 194.92L396.235 194.763C392.789 194.763 390.127 192.102 389.97 188.658ZM268.281 389.37C209.707 385.926 162.722 338.331 160.53 279.464C160.373 276.959 158.337 274.923 155.831 274.923L86.921 274.767C83.3189 274.767 80.4998 271.792 80.6564 268.191C84.102 209.637 131.713 162.668 190.6 160.476C193.106 160.32 195.142 158.284 195.142 155.779L195.298 86.7355C195.298 83.1346 198.274 80.3165 201.876 80.473C260.45 83.9174 307.434 131.512 309.627 190.38C309.783 192.885 311.819 194.92 314.325 194.92L383.236 195.077C386.838 195.077 389.657 198.051 389.5 201.652C386.055 261.772 336.095 309.524 275.172 309.524L275.015 383.108C274.858 386.709 271.883 389.527 268.281 389.37Z" fill="url(#paint0_linear_1_62)" fillOpacity="0.3"/>
                <path d="M281.264 389.34L281.257 389.341C277.558 389.509 274.672 392.378 274.672 396.102L274.515 465.302V465.303C274.515 467.665 272.571 469.496 270.166 469.499C167.225 466.997 83.8097 384.077 80.5293 281.326V281.319C80.361 277.621 77.4908 274.736 73.7656 274.736H73.7666L4.69922 274.58H4.69824C2.33692 274.58 0.50597 272.64 0.5 270.238C2.99957 167.173 85.9489 83.7825 188.735 80.6592V80.6602L188.743 80.6592C192.442 80.4911 195.328 77.6224 195.328 73.8984L195.485 4.69824V4.69727C195.485 2.33548 197.428 0.503565 199.833 0.5C302.93 3.00115 386.189 85.9215 389.47 188.673V188.674L389.471 188.681C389.639 192.379 392.509 195.262 396.233 195.263V195.264L465.301 195.42H465.302C467.667 195.42 469.5 197.367 469.5 199.773C466.994 302.677 384.047 386.061 281.264 389.34ZM201.897 79.9736C198.015 79.805 194.798 82.8459 194.798 86.7344L194.642 155.778V155.779C194.642 158 192.834 159.831 190.577 159.977C131.433 162.18 83.6177 209.353 80.1572 268.162V268.17C79.9886 272.051 83.0306 275.265 86.9199 275.266V275.267L155.83 275.424H155.831C157.986 275.424 159.775 277.124 160.013 279.284L160.031 279.495C162.24 338.616 209.426 386.41 268.251 389.869L268.259 389.87C272.146 390.039 275.346 386.997 275.515 383.13V383.109L275.67 310.02C336.633 309.76 386.548 261.9 389.999 201.681L390 201.674C390.169 197.792 387.125 194.576 383.235 194.576H383.236L314.326 194.42H314.325C312.101 194.42 310.267 192.608 310.126 190.349H310.125C307.917 131.228 260.73 83.4328 201.905 79.9736H201.897Z" stroke="url(#paint1_linear_1_62)" strokeOpacity="0.5"/>
              </g>
              <foreignObject x="180.938" y="168.875" width="125.569" height="133.271">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{backdropFilter:'blur(6px)', clipPath:'url(#bgblur_1_1_62_clip_path)', height:'100%', width:'100%'}}></div>
              </foreignObject>
              <g data-figma-bg-blur-radius="12">
                <path fillRule="evenodd" clipRule="evenodd" d="M192.938 193.348C192.938 183.875 203.094 177.869 211.395 182.435L288.054 224.598C296.658 229.33 296.658 241.692 288.054 246.424L211.395 288.587C203.094 293.152 192.938 287.147 192.938 277.674V193.348Z" fill="url(#paint2_linear_1_62)" fillOpacity="0.3"/>
                <path d="M193.438 193.348C193.438 184.255 203.186 178.491 211.154 182.873L287.814 225.036C296.072 229.577 296.072 241.444 287.814 245.986L211.154 288.149C203.186 292.53 193.438 286.766 193.438 277.673V193.348Z" stroke="url(#paint3_linear_1_62)" strokeOpacity="0.5"/>
              </g>
              <defs>
                <clipPath id="bgblur_0_1_62_clip_path" transform="translate(12 12)">
                  <path d="M389.97 188.658C386.681 85.6396 303.206 2.505 199.84 0C197.178 0 194.985 2.03531 194.985 4.69687L194.828 73.8974C194.828 77.3418 192.166 80.0033 188.72 80.1599C85.6681 83.2911 2.50583 166.895 0 270.227C0 272.888 2.03599 275.08 4.69843 275.08L73.7654 275.236C77.2109 275.236 79.8734 277.898 80.03 281.342C83.3189 384.36 166.951 467.495 270.16 470C272.822 470 275.015 467.965 275.015 465.303L275.172 396.103C275.172 392.658 277.834 389.997 281.28 389.84C384.332 386.552 467.494 302.948 470 199.773C470 197.112 467.964 194.92 465.302 194.92L396.235 194.763C392.789 194.763 390.127 192.102 389.97 188.658ZM268.281 389.37C209.707 385.926 162.722 338.331 160.53 279.464C160.373 276.959 158.337 274.923 155.831 274.923L86.921 274.767C83.3189 274.767 80.4998 271.792 80.6564 268.191C84.102 209.637 131.713 162.668 190.6 160.476C193.106 160.32 195.142 158.284 195.142 155.779L195.298 86.7355C195.298 83.1346 198.274 80.3165 201.876 80.473C260.45 83.9174 307.434 131.512 309.627 190.38C309.783 192.885 311.819 194.92 314.325 194.92L383.236 195.077C386.838 195.077 389.657 198.051 389.5 201.652C386.055 261.772 336.095 309.524 275.172 309.524L275.015 383.108C274.858 386.709 271.883 389.527 268.281 389.37Z"/>
                </clipPath>
                <clipPath id="bgblur_1_1_62_clip_path" transform="translate(-180.938 -168.875)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M192.938 193.348C192.938 183.875 203.094 177.869 211.395 182.435L288.054 224.598C296.658 229.33 296.658 241.692 288.054 246.424L211.395 288.587C203.094 293.152 192.938 287.147 192.938 277.674V193.348Z"/>
                </clipPath>
                <linearGradient id="paint0_linear_1_62" x1="235" y1="0" x2="235" y2="470" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" stopOpacity="0.5"/>
                  <stop offset="1" stopColor="white"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_62" x1="235" y1="0" x2="235" y2="470" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" stopOpacity="0"/>
                  <stop offset="1" stopColor="white"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_62" x1="243.722" y1="180.875" x2="243.722" y2="290.146" gradientUnits="userSpaceOnUse">
                  <stop offset="0.147231" stopColor="white"/>
                  <stop offset="0.42761" stopColor="white" stopOpacity="0.5"/>
                  <stop offset="1" stopColor="#1600FD" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1_62" x1="243.722" y1="180.875" x2="243.722" y2="290.146" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" stopOpacity="0"/>
                  <stop offset="1" stopColor="white"/>
                </linearGradient>
              </defs>
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