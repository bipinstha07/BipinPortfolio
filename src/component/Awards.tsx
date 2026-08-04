import scholarship from '../assets/Awards/scholarship.png'
import { motion } from 'framer-motion';

function Awards() {
  return (
    <>
        <div className="container mx-auto my-10">
            <motion.div 
                whileInView={{y:0, opacity:1}} 
                initial={{y:-20, opacity:0}} 
                transition={{duration:0.5}} 
                className="text-center relative mt-5 mb-8 px-4"
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-cyan-300 mb-4">
                    Awards & Scholarships
                </h1>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
                <motion.div 
                    whileInView={{y:0, opacity:1}} 
                    initial={{y:20, opacity:0}} 
                    transition={{duration:0.5, delay:0.1}} 
                    className="p-4 rounded-lg border border-gray-800 hover:border-red-400 transition-colors duration-300 w-48"
                >
                    <div className="rounded-lg mb-2 flex items-center justify-center bg-transparent">
                        <img src={scholarship} alt="Scholarship Certificate" className="w-full h-20 object-cover rounded-lg mb-2" />
                    </div>
                    <div className="mt-2 text-xs text-gray-300">
                        <p><strong>Year:</strong> 2023</p>
                        <p><strong>Foundation:</strong> Lalita & Janak Karn Foundation</p>
                    </div>
                </motion.div>

                <motion.div 
                    whileInView={{y:0, opacity:1}} 
                    initial={{y:20, opacity:0}} 
                    transition={{duration:0.5, delay:0.2}} 
                    className="p-4 rounded-lg border border-gray-800 hover:border-yellow-400 transition-colors duration-300 w-48"
                >
                    <div className="w-full h-20 rounded-lg mb-2 flex items-center justify-center bg-transparent">
                        <div className="text-center text-yellow-400">
                            <div className="text-lg font-bold">4.0</div>
                            <div className="text-xs">GPA</div>
                        </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-xs">
                        Achieved President's List recognition for maintaining a perfect 4.0 GPA out of 4.0.
                    </p>
                    <div className="mt-2 text-xs text-gray-300">
                        <p><strong>GPA:</strong> 4.0/4.0</p>
                        <p><strong>Recognition:</strong> President's List</p>
                    </div>
                </motion.div>

                <motion.div 
                    whileInView={{y:0, opacity:1}} 
                    initial={{y:20, opacity:0}} 
                    transition={{duration:0.5, delay:0.3}} 
                    className="p-4 rounded-lg border border-gray-800 hover:border-blue-400 transition-colors duration-300 w-48"
                >
                    <div className="w-full h-20 rounded-lg mb-2 flex items-center justify-center bg-transparent">
                        <div className="text-center text-blue-400">
                            <div className="text-lg font-bold">3.8</div>
                            <div className="text-xs">GPA</div>
                        </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-xs">
                        Earned Dean's List recognition for achieving an outstanding 3.8 GPA out of 4.0.
                    </p>
                    <div className="mt-2 text-xs text-gray-300">
                        <p><strong>GPA:</strong> 3.8/4.0</p>
                        <p><strong>Recognition:</strong> Dean's List</p>
                    </div>
                </motion.div>
                
            </div>
        </div>
    </>
  )
}

export default Awards
