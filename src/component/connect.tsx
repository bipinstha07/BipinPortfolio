import { motion } from "framer-motion"
import { FiMail, FiMapPin } from 'react-icons/fi'

export default function Connect() {
    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div 
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                <motion.h2 
                    className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    Get In Touch
                </motion.h2>

                <div className="space-y-6">
                    <motion.a 
                        href="mailto:bipinshrestha830@gmail.com"
                        className="flex items-center justify-center space-x-3 text-xl hover:text-blue-500 transition-colors duration-150"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        <FiMail className="text-2xl" />
                        <span className="hover:underline">bipinshrestha830@gmail.com</span>
                    </motion.a>

                    <motion.div 
                        className="flex items-center justify-center space-x-3 text-xl"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        <FiMapPin className="text-2xl text-red-500" />
                        <span>Monroe, LA</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}