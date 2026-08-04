import { FaNodeJs, FaReact } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { FaUbuntu } from "react-icons/fa6";
import { SiHibernate, SiJavascript, SiKubernetes, SiMongodb, SiMysql, SiSpringboot, SiDocker, SiLinux, SiAmazonec2, SiAwslambda, SiApachekafka, SiTypescript, SiGit, SiJira } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { RiTailwindCssFill, RiNextjsFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const techVar = (duration: number) => ({
    initial: { y: -10 },
    animate: {
        y: [10, -10],
        transition: {
            duration: duration,
            ease: 'linear' as const,
            repeat: Infinity,
            repeatType: 'reverse' as const,
        }
    }
})

export default function Skills() {
    return (
        <>
            <motion.div 
                whileInView={{y:0, opacity:1}} 
                initial={{y:-20, opacity:0}} 
                transition={{duration:0.5}} 
                className="text-center relative mt-25 mb-8 px-4"
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-cyan-300 mb-4">
                    Skills & Expertise
                </h2>
            </motion.div>

            <div className='flex w-full sm:w-2/3 mx-auto justify-center mt-4 mb-15 px-4'>
                <motion.div whileInView={{ x: 0, opacity: 1 }} initial={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }} className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full">
                    <div className="flex justify-center flex-wrap gap-3 sm:gap-4 w-full">
                        <motion.div variants={techVar(2)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-cyan-400">
                            <FaReact className="text-3xl sm:text-5xl text-cyan-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                85%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.5)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-orange-600">
                            <FaJava className="text-3xl sm:text-5xl text-orange-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                90%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-green-500">
                            <SiMongodb className="text-3xl sm:text-5xl text-green-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.8)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-yellow-400">
                            <FaAws className="text-3xl sm:text-5xl text-yellow-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                75%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.2)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-blue-600">
                            <SiMysql className="text-3xl sm:text-5xl text-blue-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.3)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-yellow-300">
                            <SiJavascript className="text-3xl sm:text-5xl text-yellow-300" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                85%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.5)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-green-400">
                            <FaNodeJs className="text-3xl sm:text-5xl text-green-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                85%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.8)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-green-600">
                            <SiSpringboot className="text-3xl sm:text-5xl text-green-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.7)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-blue-400">
                            <SiKubernetes className="text-3xl sm:text-5xl text-blue-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                60%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.1)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-teal-300">
                            <RiTailwindCssFill className="text-3xl sm:text-5xl text-teal-300" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                90%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.9)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-purple-500">
                            <SiHibernate className="text-3xl sm:text-5xl text-purple-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                        {/* New Icons */}
                        <motion.div variants={techVar(2.1)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-orange-500">
                            <SiDocker className="text-3xl sm:text-5xl text-orange-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                70%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.3)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-yellow-500">
                            <SiAmazonec2 className="text-3xl sm:text-5xl text-yellow-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                               91%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.4)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-red-500">
                            <SiAwslambda className="text-3xl sm:text-5xl text-red-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                75%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.6)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-yellow-600">
                            <SiLinux className="text-3xl sm:text-5xl text-yellow-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                75%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.6)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-blue-800">
                            <RiNextjsFill className="text-3xl sm:text-5xl text-blue-800" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(3.4)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-orange-400">
                            <FaUbuntu className="text-3xl sm:text-5xl text-orange-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.8)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-purple-600">
                            <SiApachekafka className="text-3xl sm:text-5xl text-purple-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                65%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.2)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-blue-500">
                            <SiTypescript className="text-3xl sm:text-5xl text-blue-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                80%
                            </div>
                        </motion.div>

                            <motion.div variants={techVar(3.7)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-orange-600">
                            <SiGit className="text-3xl sm:text-5xl text-orange-600" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                85%
                            </div>
                        </motion.div>

                        <motion.div variants={techVar(2.5)} initial="initial" animate="animate" className="relative group border border-[#2c2c2c] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-blue-500">
                            <SiJira className="text-3xl sm:text-5xl text-blue-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs sm:text-sm text-white bg-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                60%
                            </div>
                        </motion.div>

                       

                        

                    </div>
                </motion.div>
            </div>
        </>
    );
}
