import { Download, Home } from 'lucide-react'

export default function Resume() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E6E6E6' }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <a
                href="/"
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </a>
              <a href="Bipin_Shrestha_Resume.pdf" download>
                <button className="flex items-center gap-1 px-3 py-1.5 cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-15 pb-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-4 sm:p-8">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-1">Bipin Shrestha</h1>
            <div className="text-gray-600 text-[10px] sm:text-xs">
              Monroe, LA | bipinshrestha830@gmail.com | +1 318-690-8483 |
              <a href="https://github.com/bipinstha07" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">GitHub</a> |
              <a href="https://www.bipinshrestha01.com.np" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">Portfolio</a>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-black">SUMMARY</h2>
            <div className="border-b border-black mb-2"></div>
            <p className="text-[9px] sm:text-xs text-gray-700 leading-tight">
              Motivated Computer Science student passionate about software development and problem-solving.
              Proficient in Java with strong algorithms and data structures skills, experienced in full-stack web development
              and cloud/DevOps projects, AWS Certified Solutions Architect, eager to contribute innovative solutions and grow
              in a dynamic tech environment.
            </p>
          </div>

          {/* Education */}
          <div className="mb-2">
            <h2 className="text-[16px] font-bold text-black">EDUCATION</h2>
            <div className="border-b border-black mb-2"></div>
            <div className="flex justify-between items-start">
              <span className="text-[9px] sm:text-xs font-semibold text-black">University of Louisiana at Monroe</span>
              <span className="text-[9px] sm:text-xs text-gray-600">Monroe, LA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] sm:text-xs text-gray-700">Bachelor of Science in Computer Science</span>
            </div>
            <p className="text-[9px] sm:text-xs text-gray-700 ml-4">
              Data Structures and Algorithms, Object-Oriented Programming, Operating System, Computer Networks, Database Management
            </p>
          </div>

          {/* Projects */}
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-black">PROJECTS</h2>
            <div className="border-b border-black mb-2"></div>

            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[14px] font-bold text-black">Grade Forge - Automated Programming Assignment Grading Platform</h3>
                <div className="text-[9px] sm:text-xs text-blue-600">
                  <a
                    href="http://52.14.92.121:8080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    Website
                  </a>
                  <span className="mx-2">|</span>
                  <a
                    href="https://github.com/bishwo-dahal/Grade-Forge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    Repository
                  </a>
                </div>
              </div>
              <p className="text-[9px] sm:text-xs text-gray-700 mb-2 leading-tight ml-4">
                A scalable platform for managing programming assignments where instructors can create test suites and automatically
                evaluate student code submissions using containerized execution.
              </p>
              <ul className="text-[9px] sm:text-xs text-gray-700 space-y-0.5 ml-4">
                <li className="flex"><span className="mr-2">-</span><span>Led backend development of a team project, designing core architecture and coordinating the grading pipeline and APIs.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Built secure assignment/test-suite workflows where student submissions are compiled and run in isolated Docker containers.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Implemented a test-case execution engine storing compile results, runtime output, execution time, and pass/fail status.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Designed role-based access control (Faculty, TA, Student) using Spring Security for grading workflows and submission tracking.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Deployed on AWS EC2 with AWS RDS (PostgreSQL) and AWS S3 for file and artifact storage.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Planned extensibility for distributed runners, async grading queues, plagiarism detection, and analytics dashboards.</span></li>
              </ul>
              <p className="text-[9px] sm:text-xs text-gray-700 ml-4 mt-1">
                <span className="font-semibold">Tech Stack:</span> <span className="italic">Java, Spring Boot, React, TailwindCSS, Docker, PostgreSQL, AWS EC2, AWS RDS, AWS S3, AWS CodeBuild, AWS IAM, Spring Security, REST APIs, GitHub, Hibernate</span>
              </p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[14px] font-bold text-black">Hotel Booking Application</h3>
                <div className="text-[9px] sm:text-xs text-blue-600">
                  <a href="https://hotel-booking-frontend-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Website</a>
                  <span className="mx-2">|</span>
                  <a href="https://github.com/bipinstha07/Hotel_Booking" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Repository</a>
                </div>
              </div>
              <p className="text-[9px] sm:text-xs text-gray-700 mb-2 leading-tight ml-4">
                A full-stack hotel booking system for privately-owned or large hotels, built with Spring Boot, Next.js, and AWS.
              </p>
              <ul className="text-[9px] sm:text-xs text-gray-700 space-y-0.5 ml-4">
                <li className="flex"><span className="mr-2">-</span><span>Implemented secure JWT-based authentication with role-based access for users, supporting sign-up, login, bookings, payments, and profile management.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Developed admin dashboard for room management (CRUD) and booking approvals, integrated with asynchronous email notifications and Stripe payments.</span></li>
                <li className="flex"><span className="mr-2">-</span><span>Deployed backend on AWS (EC2, RDS, S3) with CI/CD, reducing deployment time from 30 mins to &lt; 5 mins.</span></li>
              </ul>
              <p className="text-[9px] sm:text-xs text-gray-700 ml-4 mt-1">
                <span className="font-semibold">Tech Stack:</span> <span className="italic">Java, Spring Boot, Spring, Next.js, AWS, MySQL, Tailwind CSS, JavaScript</span>
              </p>
            </div>
          </div>

          {/* Research & Collaboration */}
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-black">RESEARCH & COLLABORATION</h2>
            <div className="border-b border-black mb-2"></div>

            <div className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-[14px] font-bold text-black">Emerging Scholar Program Research</h3>
                <span className="text-[9px] sm:text-xs text-gray-600">Spring 2023 - Fall 2023</span>
              </div>
              <p className="text-[9px] sm:text-xs text-gray-700 leading-tight ml-4">
                <span className="italic">Academic Research</span> <span className="text-gray-600 text-xs italic">- University of Louisiana at Monroe</span>
              </p>
              <p className="text-[9px] sm:text-xs text-gray-700 leading-tight ml-4">- VR in Education - analyzed teacher perceptions of virtual reality for enhanced student engagement and experiential learning</p>
              <p className="text-[9px] sm:text-xs text-gray-700 leading-tight ml-4">- AI in Business Communication - studied impacts of AI, Robotics, and ICT on modern business operations, workforce management, and global economic trends.</p>
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-[14px] font-bold text-black">Google Developer Code (GDSC)</h3>
                <span className="text-[9px] sm:text-xs text-gray-600">Fall 2024 - Present</span>
              </div>
              <p className="text-[9px] sm:text-xs text-gray-700 leading-tight ml-4">
                <span className="italic">Active Community Member</span> - Coding competition, hackathons, and mentoring fellow developers.
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-black">CERTIFICATIONS</h2>
            <div className="border-b border-black mb-2"></div>
            <div className="space-y-1">
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">AWS Certified Solutions Architect - Associate</span>{' '}
                <a
                  href="https://www.credly.com/badges/1a1ebba5-a847-4713-ac91-ab04945d2308/linked_in?t=t762s1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">AWS Certified Developer - Associate</span>{' '}
                <a
                  href="https://www.credly.com/earner/earned/badge/db976e2c-4195-4ece-aab0-650e333d9b76"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">Java Spring Boot and Microservices</span>{' '}
                <a
                  href="https://courses.learncodewithdurgesh.com/learn/certificate/11903427-224271"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">AWS AI Practitioner</span>{' '}
                <a
                  href="https://www.credly.com/badges/a09bc87f-2c0a-4e70-a7eb-70d787abfe8a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">AWS Certified Cloud Practitioner</span>{' '}
                <a
                  href="https://www.credly.com/badges/f477c3a2-4557-40d9-abf3-5fa64e5dd87b/linked_in?t=sn4nwf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">Problem Solving (Java)</span>{' '}
                <a
                  href="https://www.hackerrank.com/certificates/4965911b13aa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">Professional Certificate in DevOps</span>{' '}
                <a
                  href="https://www.udemy.com/certificate/UC-0d836588-b391-4902-8800-8c2c73d79948/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
              <p className="text-[8px] sm:text-[11px] text-gray-700">
                <span className="font-semibold">Linux Command Line: From Zero to Hero</span>{' '}
                <a
                  href="https://www.udemy.com/certificate/UC-a7f64826-e9a5-4255-83c6-9559ad2791fa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800 italic"
                >
                  View Certificate
                </a>
              </p>
            </div>
          </div>

          {/* Technical Skill */}
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-black">TECHNICAL SKILL</h2>
            <div className="border-b border-black mb-2"></div>
            <div className="space-y-1">
              <p className="text-[9px] sm:text-xs text-gray-700"><span className="font-semibold">Frontend:</span> <span className="italic">React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5/CSS3, Tailwind CSS, Chart.js, Responsive UI</span></p>
              <p className="text-[9px] sm:text-xs text-gray-700"><span className="font-semibold">Backend & APIs:</span> <span className="italic">Java, Spring Boot, Spring AI, REST APIs, Git, JWT Authentication & Role-Based Access, AOP, Microservices</span></p>
              <p className="text-[9px] sm:text-xs text-gray-700"><span className="font-semibold">Databases & Data:</span> <span className="italic">MySQL, PostgreSQL, MongoDB, Hibernate/JPA ORM, Data Modeling, Caching</span></p>
              <p className="text-[9px] sm:text-xs text-gray-700"><span className="font-semibold">AI & Automation:</span> <span className="italic">OpenRouter API, Generative AI, Spring AI, n8n, MCP</span></p>
              <p className="text-[9px] sm:text-xs text-gray-700"><span className="font-semibold">DevOps & Cloud / Project Management:</span> <span className="italic">Docker, RabbitMQ, AWS (EC2, RDS, S3, API Gateway, Elastic Beanstalk, SNS, SQS, DynamoDB), CI/CD (CodePipeline & CodeBuild), Linux, GitHub, Jira</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}