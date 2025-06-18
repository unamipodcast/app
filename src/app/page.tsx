import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-700">UNCIP</Link>
            <nav className="hidden md:flex ml-8">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link href="#features" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Features</Link>
              <Link href="#about" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">About</Link>
              <Link href="#contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            <Link href="/auth/register" className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md flex items-center justify-center text-base">Register</Link>
          </div>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Protecting Children Through Technology</h1>
              <p className="text-xl mb-8 text-blue-100">UNCIP connects parents, schools, and authorities to create a safer environment for children in South African townships.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register" className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md flex items-center justify-center text-base">Get Started</Link>
                <Link href="#features" className="px-6 py-3 rounded-lg font-medium border-2 border-gray-300 bg-transparent text-white hover:bg-blue-700 flex items-center justify-center text-base">Learn More</Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-96 bg-white/10 rounded-2xl p-1 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-6 text-2xl font-semibold text-white">Child Safety First</h3>
                    <p className="mt-3 text-lg text-blue-100">Rapid identification and response in emergencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Key Features</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Our platform provides essential tools for child safety and identification
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Identification</h3>
              <p>Quick access to child information during emergencies when every second counts.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile-First Design</h3>
              <p>Works on basic smartphones with offline capability for areas with limited connectivity.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p>Bank-level security with POPIA compliance to protect sensitive information.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Network</h3>
              <p>Connects families, schools, and authorities for a coordinated approach to child safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-blue-700 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the UNCIP Network Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">Be part of the solution to create safer communities for children across South Africa.</p>
          <Link href="/auth/register" className="px-6 py-3 rounded-lg font-medium bg-white text-blue-700 hover:bg-gray-100 shadow-md inline-flex items-center justify-center text-base">Register Now</Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-6">UNCIP</h3>
              <p className="mb-4 text-gray-300 text-lg">
                Unami National Child Identification Program
              </p>
              <p className="text-gray-300">
                A secure, user-friendly mobile platform that enables rapid child identification and enhances community safety in South African townships.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link href="#features" className="text-gray-300 hover:text-white">Features</Link></li>
                <li><Link href="#about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link href="/auth/login" className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link href="/auth/register" className="text-gray-300 hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Contact</h3>
              <p className="text-gray-300 mb-2">info@uncip.org</p>
              <p className="text-gray-300 mb-2">+27 123 456 789</p>
              <p className="text-gray-300">Johannesburg, South Africa</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} UNCIP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}