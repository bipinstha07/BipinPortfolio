import { motion } from 'framer-motion'

function Research() {
  return (
            <>
             {/* Research Section */}
             <div className="mt-20">
                    <motion.div 
                        whileInView={{ y: 0, opacity: 1 }} 
                        initial={{ y: 30, opacity: 0 }} 
                        transition={{ duration: 0.5,delay:0.1 }} 
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-3" style={{ color: '#00B7DC' }}>
                            Research & Collaborations
                        </h2>
                        <p className="text-gray-400 text-base max-w-xl mx-auto">
                            Academic research contributions in emerging technologies and educational innovation
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Research Item 1 */}
                        <motion.div 
                            className="backdrop-blur-[2px] rounded-xl p-6"
                            style={{ 
                                background: 'linear-gradient(to bottom right, rgba(0, 183, 220, 0.1), rgba(0, 183, 220, 0.1))',
                                border: '1px solid rgba(0, 183, 220, 0.3)'
                            }}
                            whileInView={{ x: 0, opacity: 1 }} 
                            initial={{ x: -100, opacity: 0 }} 
                            transition={{ duration: 0.5,delay:0.1 }}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="lg:w-1/4">
                                    <div className="font-semibold text-base mb-1" style={{ color: '#00B7DC' }}>Spring 2023</div>
                                    <div className="text-xs" style={{ color: '#00B7DC', opacity: 0.8 }}>Emerging Scholar Program</div>
                                </div>
                                
                                <div className="lg:w-3/4">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        Teacher Candidate Perceptions of the Use of Virtual Reality as a Teaching Tool
                                    </h3>
                                    <p className="text-xs mb-3 italic" style={{ color: '#00B7DC', opacity: 0.8 }}>
                                        Research with Professor Stacia Austin
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Explored how virtual reality enhances teaching and learning, focusing on immersive learning, engagement, and practical applications. Analyzed studies showing positive teacher perceptions of VR in education for improving student participation, concept understanding, and real-life experiential learning.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Research Item 2 */}
                        <motion.div 
                            className="backdrop-blur-[2px] rounded-xl p-6"
                            style={{ 
                                background: 'linear-gradient(to bottom right, rgba(0, 183, 220, 0.1), rgba(0, 183, 220, 0.1))',
                                border: '1px solid rgba(0, 183, 220, 0.3)'
                            }}
                            whileInView={{ x: 0, opacity: 1 }} 
                            initial={{ x: 100, opacity: 0 }} 
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="lg:w-1/4">
                                    <div className="font-semibold text-base mb-1" style={{ color: '#00B7DC' }}>Fall 2023</div>
                                    <div className="text-xs" style={{ color: '#00B7DC', opacity: 0.8 }}>Emerging Scholar Program</div>
                                </div>
                                
                                <div className="lg:w-3/4">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        AI in Business Communication
                                    </h3>
                                    <p className="text-xs mb-3 italic" style={{ color: '#00B7DC', opacity: 0.8 }}>
                                        Research with Professor Veronika Humphries
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Studied the impacts of Artificial Intelligence, Robotics, and ICT on modern business operations and communication. Focused on how emerging technologies reshape business performance, workforce management, and economic factors. Analyzed global trends and challenges, including real-world examples from Nigeria and future outlooks on integrating AI into business and education systems.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Research Item 3 - Google Developer Code */}
                        <motion.div 
                            className="backdrop-blur-[2px] rounded-xl p-6"
                            style={{ 
                                background: 'linear-gradient(to bottom right, rgba(0, 183, 220, 0.1), rgba(0, 183, 220, 0.1))',
                                border: '1px solid rgba(0, 183, 220, 0.3)'
                            }}
                            whileInView={{ x: 0, opacity: 1 }} 
                            initial={{ x: -100, opacity: 0 }} 
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="lg:w-1/4">
                                    <div className="font-semibold text-base mb-1" style={{ color: '#00B7DC' }}>Fall 2024 - Present</div>
                                    <div className="text-xs" style={{ color: '#00B7DC', opacity: 0.8 }}>Google Developer Student Club</div>
                                </div>
                                
                                <div className="lg:w-3/4">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        Google Developer Student Club Community Engagement
                                    </h3>
                                    <p className="text-xs mb-3 italic" style={{ color: '#00B7DC', opacity: 0.8 }}>
                                        Active Community Member
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Actively engaged in Google Developer Student Club through participation in coding competitions and volunteer work in hosting organizational events. Contribute to hackathons and weekly coding challenges, fostering innovation and collaboration within the developer community. Focus on promoting best practices in software development, mentoring fellow developers, and organizing technical workshops that bridge the gap between theoretical knowledge and practical implementation.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            
            </>
  )
}

export default Research
