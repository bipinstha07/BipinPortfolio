import armstrong from  '../assets/armstrong.png'
import train from '../assets/train.png'
import hb1 from '../assets/HotelBooking/hb1.png'
import hb2 from '../assets/HotelBooking/hb2.png'
import hb3 from '../assets/HotelBooking/hb3.png'
import hb4 from '../assets/HotelBooking/hb4.png'
import hb5 from '../assets/HotelBooking/hb5.png'
import hb6 from '../assets/HotelBooking/hb6.png'
import hb7 from '../assets/HotelBooking/hb7.png'
import hb8 from '../assets/HotelBooking/hb8.png'
import url1 from '../assets/Url Shortener/url1.png'
import url2 from '../assets/Url Shortener/url2.png'
import url3 from '../assets/Url Shortener/url3.png'
import qz1 from '../assets/Quizes/qz1.png'
import qz2 from '../assets/Quizes/qz2.png'
import t1 from '../assets/AI-Travel-Planner/t1.png'
import t2 from '../assets/AI-Travel-Planner/t2.png'
import t3 from '../assets/AI-Travel-Planner/t3.png'
import t4 from '../assets/AI-Travel-Planner/t4.png'
import gf1 from '../assets/GradeForge/gf1.png'
import gf2 from '../assets/GradeForge/gf2.png'
import gf3 from '../assets/GradeForge/gf3.png'
import g4 from '../assets/GradeForge/g4.png'
import g5 from '../assets/GradeForge/g5.png'

import { GithubOutlined, LinkOutlined, LeftOutlined, RightOutlined, DownOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

// Image Gallery Component
function ImageGallery({ images, title }: { images: string[], title: string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative  group">
            <div className="relative inline-block">
                <img
                    className="w-[580px] h-52 lg:h-80 mx-auto object-cover  transition-all duration-500 group-hover:scale-100 rounded"
                    src={images[currentImageIndex]}
                    alt={title + ' image ' + (currentImageIndex + 1)}
                />
                <div className="absolute inset-0 bg-gray-600/60 lg:group-hover:bg-transparent transition-all duration-300 rounded hidden lg:block"></div>
            </div>
            {/* Navigation Buttons */}
            <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
                <LeftOutlined className="text-xs" />
            </button>
            <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
                <RightOutlined className="text-xs" />
            </button>
            {/* Image Counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                {currentImageIndex + 1} / {images.length}
            </div>
        </div>
    );
}

function Project() {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const projectsPerPage = 4;
    const paginationRef = useRef<HTMLDivElement>(null);
    
    const project = [
        {
            "title": "GradeForge - Automated Grading System",
            "description": "An AI-powered code submission and grading platform for universities, built with React, Spring Boot, and AWS. Students can write and submit code directly in the browser, run automated tests, and receive instant feedback, while faculty can autograde assignments, detect plagiarism, and analyze AI authorship risk. Designed as a scalable, production-ready system with Docker-based code execution and async processing.",
            "images": [g5,g4,gf1, gf2, gf3],
            "keypoints": [
                "Automated code grading with multi-language support (Java, Python)",
                "Public & private test cases with secure evaluation pipeline",
                "Flexible rubric-based grading (weighted & unweighted)",
                "AI-powered plagiarism and AI-generated code detection",
                "Group assignments with shared grading workflows",
                "Multiple evaluation methods (unit, run-based, full test suites)",
                "Class, roster, and assignment management with Canvas integration",
                "Real-time results, feedback, and grading insights dashboard",
                "Exportable reports for assignments, students, and classes",
                "Admin controls for system configuration and user management"
            ],
            "technology": "Spring_Boot React TailwindCSS Java Python JWT Hibernate JPA PostgreSQL AWS S3 EC2 REST API",
            "link": "https://www.gradeforge.tech/",
            "code": "https://github.com/bishwo-dahal/Grade-Forge"
          },
    
        {
            title: "Hotel Booking Application",
            description: "A full-stack hotel booking system for privately-owned or large hotels, built with Spring Boot, Next.js, and AWS. Customers can log in or book without an account, receive confirmation emails after booking, and wait for admin approval. Admin approves bookings, triggering another email notification.Frontend hosted on Vercel, backend deployed on AWS.",
            images: [hb1, hb2, hb3, hb4, hb5, hb6, hb7, hb8],
            keypoints: [
                "Secure JWT-based Authentication & Role-based Authorization",
                "Spring Boot backend for RESTful API development",
                "Hibernate ORM with MySQL database for data persistence",
                "Robust exception handling and validation",
                "Asynchronous email notifications and Stripe payment integration",
                "Admin & customer roles with real-time booking management",
                "Building and packaging with Maven",
                "Scalable AWS infrastructure (EC2, RDS, S3, API Gateway, Elastic Beanstalk)",
                "Automated CI/CD with AWS CodePipeline & CodeBuild"
              ]
,              
            technology: "Spring_Boot Next.js TailwindCSS TypeScript JWT Hibernate MySQL JPA MapStruct Stripe AWS EC2 RDS S3 API Gateway Elastic Beanstalk CodePipeline",
            link:'https://hotel-booking-frontend-rho.vercel.app/',
            code:'https://github.com/bipinstha07/Hotel_Booking',
        },
        {
            title: "AI Travel Planner",
            description: "An AI-powered travel planner web app where users can plan their travel by providing their travel details and the AI will plan the travel based on the details provided.",
            images:[t1,t2,t3,t4],
            keypoints:[
                "Plan travel based on user-provided details using Gemini chatbot",
                "Collect destination, dates, trip type and duration interactively",
                "AWS Backend Deployment with API Gateway and EC2",
                "FastAPI server processes and validates incoming requests",
                "Real-time data fetching from SerpAPI (Hotels, Flights, Coordinates)",
                "Personalized itinerary creation using Meta-Llama-3-8B-Instruct",
                "Combines user input with real-time travel data for accuracy",
                "Frontend built with React, TypeScript and TailwindCSS",
                "Displays final itinerary in a clean and user-friendly UI",
              ]
,              
            technology: "Python FastAPI React.js TailwindCSS TypeScript HuggingFace_API Gemini Serp_API",
            link: "https://ai-travel-planner-delta-seven.vercel.app",
            code: "https://github.com/bipinstha07/AI-Travel-Planner"
        },
        {
            title: "Quizes Microservices Application",
            description: "A microservices-based quiz generation system built with Spring Boot and Spring AI, utilizing Docker for containerization and running MongoDB and PostgreSQL inside Docker. The system generates quizzes dynamically based on selected categories and leverages AI for question creation. Includes Config Server, API Gateway, Service Registry, and Category Service for modular architecture.",
            images: [qz1, qz2],
            keypoints: [
                "Spring AI-powered Category-based dynamic quiz creation",
                "Microservices architecture with API Gateway & Service Registry",
                "Config Server for centralized configuration management",
                "MongoDB & PostgreSQL integration for data persistence",
                "Docker setup for containerized deployment",
                "RabbitMQ and Kafka integration for messaging and event streaming",
                "Resilience4j Circuit Breaker with Retry, Fallback, and Actuator Monitoring in Spring Cloud Gateway for fault tolerance and graceful degradation"
              ],
             technology: "Spring_Boot Spring_AI Docker MongoDB PostgreSQL Microservices RabbitMQ Kafka Config_Server API_Gateway Eureka_Service_Registry Externalized_Configuration",
            link: "https://github.com/bipinstha07/Quizzes-MicroService",
            code: "https://github.com/bipinstha07/Quizzes-MicroService"
        }
,                
        {
            title: "Train Management System (Backend)",
            description: "Backend API built using Java Spring Boot for managing train routes, stations, schedules, and bookings with secure authentication.",
            images: [train],
            keypoints:["Build & package with Maven; structured logging (SLF4J + Logback)",
                "RESTful APIs for trains, stations, routes, schedules, seats, bookings, payments",
                "Spring Security for authentication & authorization",
                "AOP with custom annotations for logging and payment workflow",
                "Hibernate/JPA with MySQL, pagination & sorting",
                "Admin CRUD; user search, book, view/cancel bookings, handle payments",
                "OpenAPI/Swagger UI; consistent DTO mapping & PageResponse<T>"
            ],
            technology: "Java Spring_Boot Hibernate Spring_Security JWT MySQL REST API",
            link: "https://github.com/bipinstha07/TrainSystem",
            code:'https://github.com/bipinstha07/TrainSystem'
          },
          {
            title: "Armstrong Number Checker",
            description: "Quickly verify if a number is an Armstrong number. This simple yet efficient tool takes user input and determines whether the number equals the sum of its digits each raised to the power of the number of digits.",
            technology: "HTML CSS Javascript",
            images: [armstrong],
            link:'https://bipinstha07.github.io/Armstrong/',
            code:'https://github.com/bipinstha07/Armstrong'
        }, 
    
        {
            title: "URL Shortener",
            description: "A simple and efficient URL shortening web app built using Node.js, Express, MongoDB, and EJS. It allows users to enter long URLs and generate short, shareable links. When a short link is accessed, it redirects to the original URL.",
            technology: "Node.js Express.js JWT EJS MongoDB",
            images: [url1, url2, url3],
            link:'https://url-shortener-b0ag.onrender.com/',
            code:'https://github.com/bipinstha07/URL_Shortener'
        },
        {
            title:"WSCube Clone Website",
            description:"A Fully Website",
            technology:"HTML CSS Javascript Bootstrap",
            images:[armstrong],
            link:'https://bipinstha07.github.io/wscube',
            code:'https://github.com/bipinstha07/wscube'
        }
    ]

    // Calculate pagination
    const totalPages = Math.ceil(project.length / projectsPerPage);
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const currentProjects = project.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setExpandedKey(null);
    }, [currentPage]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Pagination Component
    const Pagination = () => {
        if (totalPages <= 1) return null;

        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages);
                }
            }
            
            return pages;
        };

        return (
            <div className="flex justify-center items-center gap-2 mt-8 mb-2">
                {/* Previous Button */}
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                    <LeftOutlined className="text-xs" />
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => goToPage(page as number)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        currentPage === page
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === totalPages
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                    Next
                    <RightOutlined className="text-xs" />
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="container mx-auto py-12">
                <motion.div 
                    whileInView={{ y: 0, opacity: 1 }} 
                    initial={{ y: -20, opacity: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-cyan-300 mb-3">
                        Projects
                    </h2>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">
                        Explore my latest work showcasing full-stack development, backend systems, and modern web applications
                    </p>
                 
                </motion.div>

                {/* Pagination - Top of Projects */}
                <div ref={paginationRef} className="mb-1">
                    
                    <Pagination />
                </div>
                {totalPages > 1 && (
                        <p className="text-gray-500 mx-auto mb-5 rounded-lg p-2 text-sm  flex justify-center items-center text-center max-w-fit">
                         
                            Page {currentPage} of {totalPages} • Showing {currentProjects.length} of {project.length} projects
                            
                        </p>
                    )}
                <div className="space-y-6 mx-auto mb-16">
                    {currentProjects.map((data, index) => {
                        const globalIndex = startIndex + index;
                        const cardKey = `${globalIndex}-${data.title}`;
                        const isExpanded = expandedKey === cardKey;
                        const hasDetails =
                            (data.images && data.images.length > 1) ||
                            (data.keypoints && data.keypoints.length > 0) ||
                            Boolean(data.technology?.trim());

                        return (
                        <motion.div 
                            key={cardKey}
                            className="group relative bg-gradient-to-br from-gray-900/10 to-gray-800/10 backdrop-blur-[2px] border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-100 hover:scale-[1.01]"
                            whileInView={{ x: 0, opacity: 1 }} 
                            initial={{ x: 0, opacity: 0 }} 
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        >
                            {/* Demo & GitHub — top right */}
                            <div className="absolute top-3 right-3 z-20 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                {data.link && data.link !== '' && (
                                    <a
                                        href={data.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${data.title} live demo`}
                                        title="Live demo"
                                        className="flex h-9 items-center gap-1.5 rounded-full border border-gray-600/80 bg-black/55 px-3 text-xs font-medium text-cyan-400 backdrop-blur-sm transition-all hover:border-cyan-500 hover:bg-cyan-500/15 hover:text-cyan-300"
                                    >
                                        <LinkOutlined className="text-sm" />
                                        Demo
                                    </a>
                                )}
                                {data.code && data.code !== '' && (
                                    <a
                                        href={data.code}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${data.title} GitHub repository`}
                                        title="GitHub"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600/80 bg-black/55 text-gray-200 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10 hover:text-white"
                                    >
                                        <GithubOutlined className="text-base" />
                                    </a>
                                )}
                            </div>

                            {/* Collapsed summary: first image + title + description (click to expand) */}
                            <button
                                type="button"
                                onClick={() => hasDetails && setExpandedKey(isExpanded ? null : cardKey)}
                                disabled={!hasDetails}
                                className={`w-full text-left ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
                                aria-expanded={isExpanded}
                            >
                                <div className="flex flex-col gap-4 p-4 pt-14 sm:pt-4 lg:flex-row lg:items-start">
                                    <motion.div
                                        className="mx-auto w-full max-w-xl shrink-0 overflow-hidden rounded-lg lg:mx-0 lg:w-2/5 lg:max-w-none"
                                        whileInView={{ x: 0, opacity: 1 }}
                                        initial={{ x: -50, opacity: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                    >
                                        <img
                                            className="h-48 w-full object-cover sm:h-52 lg:h-56"
                                            src={data.images[0]}
                                            alt={data.title}
                                        />
                                    </motion.div>
                                    <motion.div
                                        className="min-w-0 flex-1 pr-2 sm:pr-[5.5rem] lg:pr-32"
                                        whileInView={{ x: 0, opacity: 1 }}
                                        initial={{ x: 100, opacity: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                    >
                                        <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-cyan-400">
                                            {data.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-gray-300">
                                            {data.description}
                                        </p>
                                        {hasDetails && (
                                            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-cyan-400">
                                                <DownOutlined
                                                    className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                />
                                                {isExpanded ? 'Hide details' : 'Show details'}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </button>

                            {/* Expanded: gallery + key features + tech (slides down) */}
                            <AnimatePresence initial={false}>
                                {isExpanded && hasDetails && (
                                    <motion.div
                                        key="details"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                        className="overflow-hidden border-t border-gray-700/50"
                                    >
                                        <div className="space-y-5 px-4 pb-6 pt-4">
                                            {data.images.length > 1 && (
                                                <motion.div
                                                    className="flex justify-center"
                                                    whileInView={{ x: 0, opacity: 1 }}
                                                    initial={{ x: -50, opacity: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.1 }}
                                                >
                                                    <ImageGallery images={data.images} title={data.title} />
                                                </motion.div>
                                            )}

                                            <motion.div
                                                className="space-y-5"
                                                whileInView={{ x: 0, opacity: 1 }}
                                                initial={{ x: 100, opacity: 0 }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                            >
                                                {data.keypoints && data.keypoints.length > 0 && (
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-semibold text-cyan-400">Key Features</h4>
                                                        <ul className="list-inside list-disc space-y-1">
                                                            {data.keypoints.map((point, pointIndex) => (
                                                                <li key={pointIndex} className="text-xs leading-relaxed text-gray-300">
                                                                    {point}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {data.technology?.trim() && (
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-semibold text-cyan-400">Tech stack</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {data.technology.split(/\s+/).filter(Boolean).slice(0, 20).map((tech, techIndex) => (
                                                                <span
                                                                    key={techIndex}
                                                                    className="rounded border border-gray-700/50 bg-gray-800/50 px-2 py-1 text-xs text-gray-300 transition-colors hover:border-cyan-500/50"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        );
                    })}
                </div>

               
            </div>
        </>
    )
}

export default Project;