import ai from './ai.png'

function PrivacyBravify() {
  return (
    <div>
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img src={ai} alt="Bravify Logo" className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Bravify Privacy Policy</h1>
          </div>
          <p className="text-gray-600 text-lg">Last updated: January 2026</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="text-blue-800 font-medium">
              Bravify respects your privacy. This extension analyzes resumes and job descriptions to provide AI-powered matching insights.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
              </span>
              Data We Collect
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Resume text provided by the user
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Job description text provided by the user
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-green-100 text-green-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </span>
              How Data Is Used
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Data is used only to generate match analysis and improvement suggestions
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Data is processed temporarily and is not stored permanently
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-purple-100 text-purple-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </span>
              Data Sharing
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Data may be sent securely to AI services only for analysis purposes
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                We do not sell, store, or share personal data with third parties
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-red-100 text-red-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              Data Security
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                All data is transmitted securely
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                No user data is retained after analysis
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-yellow-100 text-yellow-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </span>
              User Control
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Users choose what data to analyze
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Uninstalling the extension removes all access
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-100 text-gray-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              Contact
            </h2>
            <p className="text-gray-700 mb-2">If you have questions:</p>
            <p className="text-gray-700">
              Email: <a href="mailto:bipinshrestha830@gmail.com" className="text-blue-600 hover:text-blue-800 underline">bipinshrestha830@gmail.com</a>
            </p>
            <p className="text-gray-700 mt-2">
              Website: <a href="https://bipinshrestha01.com.np" className="text-blue-600 hover:text-blue-800 underline">Bipin Shrestha's Portfolio</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyBravify
