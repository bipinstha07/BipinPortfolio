import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'

interface Article {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  featured: boolean
  content: string
  detailedContent: string
}

function Life() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const articles = [
    {
      id: 1,
      title: "How I Built a Facebook Group with Over 140,000 Members",
      excerpt: "What started as a small school project turned into a global Facebook community with over 100,000 members. Space Time became a place where people share their love for space and science every day.",
      author: "Bipin Shrestha",
      date: "Oct 15, 2025",
      readTime: "5 min read",
      featured: true,
      content: "What started as a small Facebook group for a few school friends turned into a thriving global community of over 100,000 members. Space Time became a place where people from around the world could share their love for space, science, and discovery. This is the story of how a simple idea grew far beyond what I imagined.",
      detailedContent: `
      Eight years ago, when I was still in school, I created a Facebook group called Space Time  a small online space for people who loved science, astronomy, and curiosity about the universe. It began with just 20–30 of my friends, and for years, I kept posting daily  sharing NASA discoveries, space facts, and thought-provoking discussions. Growth was slow at first, but I stayed consistent, engaging members through polls, fun facts, and community conversations. Little by little, people started inviting their friends, and the group began to take shape.
<br><br>
After a few years, Facebook’s algorithm started recommending Space Time to more users. New members joined daily, engagement skyrocketed, and the group started growing on its own. I focused on keeping it clean, active, and valuable removing spam, encouraging discussions, and featuring the best posts. These small actions paid off as the group eventually crossed 100,000 members, something I never imagined when I started.
<br><br>
Running Space Time taught me powerful lessons about patience, consistency, and community building. I learned that real growth takes time, engagement matters more than numbers, and passion combined with persistence can turn a small idea into something extraordinary.
<br><br>
You can check it out here: 👉 <a 
  style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline' }} 
  href="https://www.facebook.com/groups/1578981188801831" 
  target="_blank"
>
  Space Time Facebook Group
</a>
<br><br>
<img width="100%" src="/spacetime.png" alt="Space Time" />

      `
    },
    {
      id: 2,
      title: "Newars in Nepal",
      excerpt: "Sharing stories, traditions, and pride in the living culture of the Newar community.",
      author: "Bipin Shrestha", 
      date: "Oct 24, 2025",
      readTime: "2 min read",
      featured: false,
      content: "Sharing stories, traditions, and pride in the living culture of the Newar community.",
      detailedContent: `
<p>As someone deeply connected to my roots, I created  <a style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline' }} href="https://newarcivilization.blogspot.com/" target="_blank">Newars in Nepal</a> to celebrate and preserve the incredible heritage of the Newar community one of Nepal’s oldest and most culturally rich civilizations. Growing up, I was always fascinated by our traditions, festivals, and language, and I realized how important it is to keep them alive in today’s fast-changing world. <br> <br> Through this blog, I share stories like <em>The Story of Newar People: History, Culture, and Modern Identity</em>, explore our beautiful festivals such as <em>Newa Matina Paru</em> (Newar Valentine’s Day), and highlight traditional performances like the <em>Lakhey</em> dance that bring our culture to life. I also write and share poems in Nepal Bhasa (Newari language) to honor the language that carries our history and emotions. Every post is a small attempt to help others both Newars and non-Newars understand the depth and beauty of our customs, from the meanings behind surnames like <em>Shrestha</em> to the living tradition of the <em>Kumari</em>, our Living Goddess. To me, this blog isn’t just a collection of articles it’s a digital space where I express pride, reflect on identity, and invite others to join in preserving the essence of who we are as Newars.</p>
<br>
Link to the blog: <a  href="https://newarcivilization.blogspot.com/" target="_blank">Newars in Nepal</a>
<br>
<br>
<img width="100%" src="/newa.png" alt="Space Time" />`
    },
    {
      id: 3,
      title: "Delayed Choice Quantum Eraser",
      excerpt: "Delayed Choice Quantum Eraser is a thought experiment that demonstrates the wave-particle duality of light and matter. It is a thought experiment that demonstrates the wave-particle duality of light and matter.",
      author: "Bipin Shrestha",
      date: "Nov 21, 2025", 
      readTime: "6 min read",
      featured: false,
      content: "",
      detailedContent: `The delayed choice quantum eraser shows that whether a photon forms an interference pattern depends on whether its which path information is available, even if the choice to keep or erase that information is made after the photon is detected. When the path is known, the interference disappears; when the path is erased, the interference reappears  but only after pairing the results with its entangled partner. This doesn’t mean the future affects the past. Instead, it shows that quantum particles don’t have definite behavior until measurement, and that entanglement plus data correlation creates the appearance of retrocausality without any actual backward flow of information. <br><br> Link to the simulation: <a  href="/blog/experiment/quantum" target="_blank">Delayed Choice Quantum Eraser Simulation</a>`
    },
    {
      id: 4,
      title: "Black Hole Simulation",
      excerpt: "A simulation of a black hole using the laws of physics.",
      author: "Bipin Shrestha",
      date: "Nov 29, 2025",
      readTime: "1 min read", 
      featured: false,
      content: "",
      detailedContent: `A simulation of a black hole using the laws of physics.
      This simulation recreates the gravitational lensing effects around a supermassive black hole, similar to Gargantua from the movie Interstellar. The visualization includes:
      <br><br>
      • <strong>Event Horizon:</strong> The point of no return, rendered with subtle rim lighting effects
      <br>
      • <strong>Accretion Disk:</strong> Hot plasma spiraling into the black hole with realistic Keplerian rotation
      <br>
      • <strong>Gravitational Lensing:</strong> Background stars are distorted by the black hole's immense gravity
      <br>
      • <strong>Particle Effects:</strong> Glowing matter being torn apart and accelerated to incredible speeds
      <br><br>
      The simulation uses WebGL shaders to achieve real-time rendering of these complex physics phenomena. You can interact with the camera controls to explore different angles and adjust various parameters like mass, disk color, and rotation speed to see how they affect the black hole's appearance.
      <br><br> Link to the simulation: <a  href="/blog/experiment/blackhole" target="_blank">Black Hole Simulation</a>
      <br>
      <img width="100%" src="/BlackHole.png" alt="Black Hole Simulation" />
      
      `
    }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-9xl mx-auto  sm:px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Journey of My Life</h1>
          <p className="text-gray-300 text-lg">From Thought to Word.</p>
        </motion.div>

        {/* Featured Article */}
        {articles.filter(article => article.featured).map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-12"
          >
            <div className="bg-gray-800/50 rounded-2xl p-8 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-400 text-sm">{article.readTime}</span>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-2 cursor-pointer">
                {article.title}
              </h2>
              
              
              <p className="text-gray-200 mb-6 text-lg leading-relaxed max-w-3xl cursor-pointer">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="cursor-pointer">
                    <p className="font-semibold text-white text-lg">{article.author}</p>
                    <p className="text-gray-300">{article.date}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedArticle(article)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20 cursor-pointer"
                  >
                    Read More →
                  </button>
                  
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {articles.filter(article => !article.featured).map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className="bg-gray-800/50 rounded-xl  p-6 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 text-xs">{article.readTime}</span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2 hover:text-blue-400 cursor-pointer transition-colors">
                {article.title}
              </h2>
              
              
              <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="cursor-pointer">
                    <p className="font-medium text-white text-sm">{article.author}</p>
                    <p className="text-xs text-gray-400">{article.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedArticle(article)}
                  className="text-blue-400 hover:text-blue-300 font-medium text-sm cursor-pointer"
                >
                  Read More →
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Detailed Article Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedArticle(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{selectedArticle.readTime}</span>
                    </div>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {selectedArticle.title}
                  </h1>
                  

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                      {selectedArticle.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="cursor-pointer">
                      <p className="font-semibold text-white text-lg">{selectedArticle.author}</p>
                      <p className="text-gray-400">{selectedArticle.date}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div 
                    className="prose prose-lg text-gray-300 max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-p:leading-relaxed prose-ul:text-gray-300 prose-li:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.detailedContent }}
                  />

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="px-4 py-1 border border-gray-600 hover:border-gray-200 text-white hover:text-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}




export default Life
