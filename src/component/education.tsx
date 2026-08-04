
import ulm from '../assets/ulm.png'
import aws from '../assets/cloudAws.png'
import hackerank from '../assets/hackerank.png'
import awsai from "../assets/awsai.png"
import { Link } from 'react-router'
import saylor from '../assets/saylor.png'
import udemy from '../assets/udemy.png'
import solutionarchitect from '../assets/solutionarchitect.png'
import developer from '../assets/developer.png'

import devops from '../assets/devops.png'

import { motion } from 'framer-motion'
import { GraduationCap, Award, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const data = [
    {
        title: 'University of Louisiana at Monroe',
        subtitle: "Bachelor's Degree in Computer Science (Expected 2026)",
        img: ulm,
        link: null,
        type: 'education',
        gpa: 'GPA: 3.6/4.0'
    },
    {
        title:'AWS Certified Solutions Architect - Associate',
        subtitle: (<>Amazon Web Services (Issued 2025)  <Link to="https://www.credly.com/badges/1a1ebba5-a847-4713-ac91-ab04945d2308/linked_in?t=t762s1" target='_blank' className='text-blue-500'>View Certificate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Link>

        </>),
        img: solutionarchitect,
        link: "https://www.credly.com/badges/1a1ebba5-a847-4713-ac91-ab04945d2308/linked_in?t=t762s1",
        type: 'certification'
    },
    {
        title:"AWS Certified Developer - Associate",
        subtitle: (<>Amazon Web Services (Issued 2026)  <Link to="https://www.credly.com/earner/earned/badge/db976e2c-4195-4ece-aab0-650e333d9b76" target='_blank' className='text-blue-500'>View Certificate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Link>

        </>),
        img: developer,
        link: "https://www.credly.com/earner/earned/badge/db976e2c-4195-4ece-aab0-650e333d9b76",
        type: 'certification'
    },
    {
        title:'AWS AI Practitioner',
        subtitle: (<>Amazon Web Services (Issued 2025)  <Link to="https://www.credly.com/badges/a09bc87f-2c0a-4e70-a7eb-70d787abfe8a" target='_blank' className='text-blue-500'>View Certificate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Link>

        </>),
        img: awsai,
        link: "https://www.credly.com/badges/f477c3a2-4557-40d9-abf3-5fa64e5dd87b/linked_in?t=sn4nwf",
        type: 'certification'
    },

    {
        title: 'AWS Certified Cloud Practitioner',
        subtitle: (<>Amazon Web Services (Issued 2024)  <Link to="https://www.credly.com/badges/f477c3a2-4557-40d9-abf3-5fa64e5dd87b/linked_in?t=sn4nwf" target='_blank' className='text-blue-500'>View Certificate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Link>

        </>),
        img: aws,
        link: "https://www.credly.com/badges/f477c3a2-4557-40d9-abf3-5fa64e5dd87b/linked_in?t=sn4nwf",
        type: 'certification'
    },
    {
        title: 'Problem Solving (Java)',
        subtitle: (
            <>
                HackerRank Earned March 2024{' '}
                <Link to="https://www.hackerrank.com/certificates/4965911b13aa" target="_blank" className="text-blue-500">
                    View Certificate
                </Link><br />
                <span className="text-gray-500 text-[10px]">
                    Covers Java : classes,objects, methods, control statements, <br /> data structures,  inheritance, exception handling (Java 7/8).
                </span>
            </>
        ),
        img: hackerank,
        link: "https://www.hackerrank.com/certificates/4965911b13aa",
        type: 'certification'
    },
    {
        title: 'Professional Certificate in DevOps',
        subtitle: (
            <>
                Udemy Earned Jan 2025{' '}
                <Link to="https://www.udemy.com/certificate/UC-0d836588-b391-4902-8800-8c2c73d79948/" target="_blank" className="text-blue-500">
                    View Certificate
                </Link><br />
                <span className="text-gray-500 text-[10px]">
                Skilled in DevOps practices including Git version control, CI/CD pipelines, containers, configuration management, monitoring & logging, and cloud computing.  
                </span>
            </>
        ),
        img: devops,
        link: "https://www.udemy.com/certificate/UC-0d836588-b391-4902-8800-8c2c73d79948/",
        type: 'certification'
    },

    {
        title: 'Linux Command Line: From Zero to Hero',
        subtitle: (
            <>
                Udemy Earned May 2025{' '}
                <Link to="https://www.udemy.com/certificate/UC-a7f64826-e9a5-4255-83c6-9559ad2791fa" target="_blank" className="text-blue-500">
                    View Certificate
                </Link><br />
                <span className="text-gray-500 text-[10px]">
                Skilled in using Linux commands for managing files, users, software, tasks, system monitoring, and firewall settings.  </span>
            </>
        ),
        img: udemy,
        link: "https://www.udemy.com/certificate/UC-a7f64826-e9a5-4255-83c6-9559ad2791fa",
        type: 'certification'
    },
    {
        title: 'CS406: Information Security',
        subtitle: (
            <>
                Saylor Academy Earned May 2025{' '}
                <Link to="https://learn.saylor.org/pluginfile.php/1/tool_certificate/issues/1746495391/0234703439BS.pdf" target="_blank" className="text-blue-500">
                    View Certificate
                </Link><br />
                <span className="text-gray-500 text-[10px]">
                    Solid understanding of key information security concepts, including  modes of threats <br /> and attacks on information systems, threat mitigation, cryptography, user identification <br />and authentication, access control, privacy laws, and more.
                </span>
            </>
        ),
        img: saylor,
        link: "https://www.hackerrank.com/certificates/4965911b13aa",
        type: 'certification'
    },
   
];

export default function Education() {
    const [showAllCertifications, setShowAllCertifications] = useState(false);

    // Separate education and certifications
    const educationItems = data.filter(item => item.type === 'education');
    const certificationItems = data.filter(item => item.type === 'certification');
    
    // Show only top 5 certifications initially
    const displayedCertifications = showAllCertifications 
        ? certificationItems 
        : certificationItems.slice(0, 3);
    
    const hasMoreCertifications = certificationItems.length > 5;

    const renderItem = (item: typeof data[0], index: number) => (
        <motion.div 
            key={index}
            className="group sm:w-2/3 mx-auto relative bg-gradient-to-br from-gray-900/10 to-gray-800/10 backdrop-blur-[2px] border border-gray-700/50 rounded-lg overflow-hidden hover:border-cyan-600/50 transition-all duration-500 h-28"
            whileInView={{ y: 0, opacity: 1 }} 
            initial={{ y: -0, opacity: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
        >
            <div className="flex flex-row h-full">
                {/* Image Container - Left Side */}
                <motion.div 
                    className="w-28 relative h-full overflow-hidden flex items-center justify-center p-3"
                    whileInView={{ x: 0, opacity: 1 }} 
                    initial={{ x: -100, opacity: 0 }} 
                    transition={{ duration: 0.6, delay: 0.1}}
                >
                    <div className="relative w-24 h-24">
                        <motion.img 
                            className="w-full h-full object-contain transition-transform duration-500 " 
                            src={item.img} 
                            alt={item.title}
                        />
                    </div>
                    <div className="absolute top-2 right-2">
                        {item.type === 'education' ? (
                            <GraduationCap className="w-5 h-5 text-blue-400" />
                        ) : (
                            <Award className="w-5 h-5 text-yellow-400" />
                        )}
                    </div>
                </motion.div>

                {/* Content - Right Side */}
                <motion.div 
                    className="flex-1 p-3 flex flex-col justify-center"
                    whileInView={{ x: 0, opacity: 1 }} 
                    initial={{ x: 100, opacity: 0 }} 
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 truncate">
                            {item.title}
                        </h3>
                        {item.gpa && (
                            <span className="text-xs text-cyan-400 font-medium bg-cyan-400/10 px-1.5 py-0.5 rounded text-center">
                                {item.gpa}
                            </span>
                        )}
                    </div>
                    
                    <div className="text-gray-400 text-[10px] leading-tight line-clamp-3">
                        {item.subtitle}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <>
            <div className="container mx-auto">
                <motion.div 
                    whileInView={{ y: 0, opacity: 1 }} 
                    initial={{ y: -20, opacity: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-cyan-300 mb-4">
                        Education & Certifications
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        My academic journey and professional certifications that showcase my expertise
                    </p>
                </motion.div>

                <div className="space-y-2">
                    {/* Education Items */}
                    {educationItems.map((item, index) => renderItem(item, index))}
                    
                    {/* Certifications - Top 5 or All */}
                    {displayedCertifications.map((item, index) => renderItem(item, educationItems.length + index))}
                    
                    {/* View More Button */}
                    {hasMoreCertifications && (
                        <motion.div
                            className="flex justify-center mt-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <button
                                onClick={() => setShowAllCertifications(!showAllCertifications)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
                            >
                                <span className="text-sm font-medium">
                                    {showAllCertifications ? 'Show Less' : 'View More Certifications'}
                                </span>
                                {showAllCertifications ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    )
}