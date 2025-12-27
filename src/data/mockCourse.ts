const lmsCourses = [
//   {
//     // Basic Information
//     courseCode: "CS101",
//     title: "Introduction to Computer Science",
//     subtitle: "Master Programming Fundamentals with Python",
//     description: "Learn the fundamentals of programming, algorithms, and computational thinking. This comprehensive course covers basic programming concepts, data structures, and problem-solving techniques that will prepare you for a career in technology.",
//     shortDescription: "Learn programming basics with Python and build your first applications",
    
//     // Instructor Information
//     instructor: {
//       name: "Dr. Sarah Mitchell",
//       title: "Professor of Computer Science",
//       bio: "PhD in Computer Science with 15 years of teaching experience",
//       avatar: "https://example.com/avatars/sarah-mitchell.jpg",
//       email: "sarah.mitchell@example.com",
//       rating: 4.8
//     },
    
//     // Course Details
//     category: "Computer Science",
//     subcategory: "Programming",
//     level: "Beginner",
//     language: "English",
//     subtitles: ["English", "Spanish", "French"],
//     duration: {
//       hours: 48,
//       weeks: 12,
//       hoursPerWeek: 4
//     },
    
//     // Pricing
//     pricing: {
//       amount: 299.99,
//       currency: "USD",
//       discountPrice: 199.99,
//       discountPercentage: 33,
//       discountExpiry: "2025-01-31T23:59:59Z"
//     },
    
//     // Enrollment Information
//     enrollment: {
//       totalStudents: 1247,
//       capacity: 500,
//       currentEnrollment: 423,
//       status: "open", // open, closed, waitlist, coming_soon
//       startDate: "2025-01-10T00:00:00Z",
//       endDate: "2025-04-05T23:59:59Z",
//       enrollmentDeadline: "2025-01-08T23:59:59Z",
//       waitlistAvailable: true
//     },
    
//     // Ratings and Reviews
//     ratings: {
//       average: 4.7,
//       total: 389,
//       distribution: {
//         5: 245,
//         4: 98,
//         3: 32,
//         2: 10,
//         1: 4
//       }
//     },
    
//     // Course Content
//     curriculum: [
//       {
//         moduleId: "MOD001",
//         title: "Getting Started with Programming",
//         description: "Introduction to programming concepts and Python basics",
//         order: 1,
//         duration: 240, // minutes
//         lessons: [
//           {
//             lessonId: "LES001",
//             title: "Course Introduction",
//             type: "video", // video, reading, quiz, assignment, discussion
//             duration: 15,
//             isPreview: true,
//             videoUrl: "https://example.com/videos/cs101-intro.mp4",
//             thumbnailUrl: "https://example.com/thumbnails/les001.jpg",
//             content: {
//               videoUrl: "https://example.com/videos/cs101-intro.mp4",
//               videoQuality: ["1080p", "720p", "480p"],
//               subtitles: ["en", "es", "fr"],
//               resources: [
//                 {
//                   title: "Course Syllabus",
//                   type: "pdf",
//                   url: "https://example.com/resources/syllabus.pdf"
//                 }
//               ]
//             }
//           },
//           {
//             lessonId: "LES002",
//             title: "Installing Python",
//             type: "video",
//             duration: 20,
//             isPreview: false,
//             videoUrl: "https://example.com/videos/install-python.mp4",
//             thumbnailUrl: "https://example.com/thumbnails/les002.jpg",
//             content: {
//               videoUrl: "https://example.com/videos/install-python.mp4",
//               videoQuality: ["1080p", "720p", "480p"],
//               subtitles: ["en", "es"],
//               resources: []
//             }
//           },
//           {
//             lessonId: "LES003",
//             title: "Your First Python Program",
//             type: "assignment",
//             duration: 60,
//             isPreview: false,
//             content: {
//               instructions: "Write a Python program that prints 'Hello, World!'",
//               submissionType: "file",
//               maxPoints: 10,
//               dueDate: "2025-01-17T23:59:59Z"
//             }
//           }
//         ],
//         quiz: {
//           quizId: "QUIZ001",
//           title: "Module 1 Quiz",
//           questions: 10,
//           duration: 30,
//           passingScore: 70,
//           attempts: 3
//         }
//       },
//       {
//         moduleId: "MOD002",
//         title: "Variables and Data Types",
//         description: "Learn about variables, data types, and basic operations",
//         order: 2,
//         duration: 300,
//         lessons: [
//           {
//             lessonId: "LES004",
//             title: "Understanding Variables",
//             type: "video",
//             duration: 25,
//             isPreview: false,
//             videoUrl: "https://example.com/videos/understanding-variables.mp4",
//             thumbnailUrl: "https://example.com/thumbnails/les004.jpg",
//             content: {
//               videoUrl: "https://example.com/videos/understanding-variables.mp4",
//               videoQuality: ["1080p", "720p", "480p"],
//               subtitles: ["en"]
//             }
//           },
//           {
//             lessonId: "LES005",
//             title: "Working with Numbers",
//             type: "video",
//             duration: 30,
//             isPreview: false,
//             videoUrl: "https://example.com/videos/working-with-numbers.mp4",
//             thumbnailUrl: "https://example.com/thumbnails/les005.jpg",
//             content: {
//               videoUrl: "https://example.com/videos/working-with-numbers.mp4",
//               videoQuality: ["1080p", "720p", "480p"],
//               subtitles: ["en"]
//             }
//           }
//         ]
//       }
//     ],
    
//     // Prerequisites
//     prerequisites: {
//       required: [],
//       recommended: ["Basic computer skills", "High school mathematics"]
//     },
    
//     // Learning Outcomes
//     learningOutcomes: [
//       "Write basic programs in Python",
//       "Understand fundamental data structures like lists, dictionaries, and sets",
//       "Apply algorithmic thinking to solve real-world problems",
//       "Debug and test code effectively using industry-standard tools",
//       "Implement object-oriented programming concepts"
//     ],
    
//     // Skills
//     skills: [
//       "Python Programming",
//       "Problem Solving",
//       "Algorithmic Thinking",
//       "Data Structures",
//       "Code Debugging"
//     ],
    
//     // Tags
//     tags: ["programming", "python", "beginner", "computer-science", "coding"],
    
//     // Requirements
//     requirements: {
//       software: ["Python 3.x", "VS Code or any text editor"],
//       hardware: ["Computer with internet connection", "Minimum 4GB RAM"],
//       other: ["Willingness to practice coding daily"]
//     },
    
//     // Target Audience
//     targetAudience: [
//       "Absolute beginners with no programming experience",
//       "Students preparing for computer science degrees",
//       "Career changers interested in technology",
//       "Anyone wanting to learn programming basics"
//     ],
    
//     // Certificates
//     certificate: {
//       available: true,
//       type: "completion", // completion, verified
//       criteria: {
//         minimumScore: 70,
//         completionRate: 80,
//         projectSubmissions: true
//       }
//     },
    
//     // Course Materials
//     materials: {
//       videos: 45,
//       readings: 12,
//       quizzes: 10,
//       assignments: 8,
//       projects: 2,
//       downloadableResources: 25
//     },
    
//     // Features
//     features: {
//       lifetimeAccess: true,
//       mobileAccess: true,
//       discussionForum: true,
//       liveQA: true,
//       peerReview: true,
//       offlineViewing: true,
//       closedCaptions: true,
//       certificateOfCompletion: true
//     },
    
//     // Status and Publishing
//     status: {
//       isPublished: true,
//       isDraft: false,
//       isFeatured: true,
//       isArchived: false,
//       publishedDate: "2024-01-15T10:30:00Z",
//       lastUpdated: "2024-11-20T14:45:00Z"
//     },
    
//     // Media
//     media: {
//       thumbnail: "https://example.com/images/cs101-thumb.jpg",
//       coverImage: "https://example.com/images/cs101-cover.jpg",
//       promoVideo: "https://example.com/videos/cs101-promo.mp4"
//     },
    
//     // Metadata
//     metadata: {
//       createdBy: "ADMIN001",
//       createdAt: "2024-01-15T10:30:00Z",
//       updatedBy: "ADMIN001",
//       updatedAt: "2024-11-20T14:45:00Z",
//       version: "2.1"
//     }
//   },
  
  {
    courseCode: "WD202",
    title: "Full-Stack Web Development Bootcamp",
    subtitle: "Build Modern Web Applications from Scratch",
    description: "Master modern web development with React, Node.js, Express, and MongoDB. This intensive bootcamp will take you from basics to building production-ready full-stack applications with industry-standard tools and best practices.",
    shortDescription: "Become a full-stack developer in 16 weeks",
    
    instructor: {
      name: "Prof. Michael Chen",
      title: "Senior Full-Stack Developer",
      bio: "10+ years building web applications for Fortune 500 companies",
      avatar: "https://example.com/avatars/michael-chen.jpg",
      email: "michael.chen@example.com",
      rating: 4.9
    },
    
    category: "Web Development",
    subcategory: "Full-Stack",
    level: "Advanced",
    language: "English",
    subtitles: ["English", "Spanish"],
    duration: {
      hours: 120,
      weeks: 16,
      hoursPerWeek: 7.5
    },
    
    pricing: {
      amount: 499.99,
      currency: "USD",
      discountPrice: null,
      discountPercentage: 0,
      discountExpiry: null
    },
    
    enrollment: {
      totalStudents: 892,
      capacity: 300,
      currentEnrollment: 267,
      status: "open",
      startDate: "2025-02-01T00:00:00Z",
      endDate: "2025-05-25T23:59:59Z",
      enrollmentDeadline: "2025-01-29T23:59:59Z",
      waitlistAvailable: true
    },
    
    ratings: {
      average: 4.9,
      total: 267,
      distribution: {
        5: 220,
        4: 38,
        3: 6,
        2: 2,
        1: 1
      }
    },
    
    curriculum: [
      {
        moduleId: "MOD010",
        title: "Frontend Development with React",
        description: "Master React and modern frontend development",
        order: 1,
        duration: 900,
        lessons: [
          {
            lessonId: "LES010",
            title: "React Fundamentals",
            type: "video",
            duration: 45,
            isPreview: true,
            videoUrl: "https://example.com/videos/react-fundamentals.mp4",
            thumbnailUrl: "https://example.com/thumbnails/les010.jpg",
            content: {
              videoUrl: "https://example.com/videos/react-fundamentals.mp4",
              videoQuality: ["1080p", "720p", "480p"],
              subtitles: ["en", "es"]
            }
          },
          {
            lessonId: "LES011",
            title: "Component Architecture",
            type: "video",
            duration: 50,
            isPreview: false,
            videoUrl: "https://example.com/videos/component-architecture.mp4",
            thumbnailUrl: "https://example.com/thumbnails/les011.jpg",
            content: {
              videoUrl: "https://example.com/videos/component-architecture.mp4",
              videoQuality: ["1080p", "720p", "480p"],
              subtitles: ["en", "es"]
            }
          },
          {
            lessonId: "LES012",
            title: "Build a React App",
            type: "project",
            duration: 180,
            isPreview: false
          }
        ]
      },
      {
        moduleId: "MOD011",
        title: "Backend Development with Node.js",
        description: "Create robust server-side applications",
        order: 2,
        duration: 960,
        lessons: []
      }
    ],
    
    prerequisites: {
      required: ["HTML/CSS", "JavaScript ES6+", "Git & GitHub"],
      recommended: ["Basic command line usage", "HTTP protocol basics"]
    },
    
    learningOutcomes: [
      "Build full-stack web applications from scratch",
      "Master React and modern frontend frameworks",
      "Design and implement RESTful APIs with Node.js",
      "Work with databases using MongoDB",
      "Deploy applications to cloud platforms like AWS or Heroku",
      "Implement authentication and authorization",
      "Write unit and integration tests"
    ],
    
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "RESTful APIs",
      "Authentication",
      "Deployment",
      "Testing"
    ],
    
    tags: ["web-development", "react", "nodejs", "full-stack", "mongodb", "javascript"],
    
    requirements: {
      software: ["Node.js", "VS Code", "Git", "MongoDB", "Postman"],
      hardware: ["Computer with 8GB+ RAM", "Stable internet connection"],
      other: ["GitHub account", "Dedication of 7-8 hours per week"]
    },
    
    targetAudience: [
      "Developers with JavaScript experience wanting to go full-stack",
      "Frontend developers wanting to learn backend",
      "Career changers with basic programming knowledge",
      "Computer science students preparing for internships"
    ],
    
    certificate: {
      available: true,
      type: "verified",
      criteria: {
        minimumScore: 80,
        completionRate: 90,
        projectSubmissions: true
      }
    },
    
    materials: {
      videos: 78,
      readings: 24,
      quizzes: 15,
      assignments: 12,
      projects: 4,
      downloadableResources: 45
    },
    
    features: {
      lifetimeAccess: true,
      mobileAccess: true,
      discussionForum: true,
      liveQA: true,
      peerReview: true,
      offlineViewing: true,
      closedCaptions: true,
      certificateOfCompletion: true
    },
    
    status: {
      isPublished: true,
      isDraft: false,
      isFeatured: true,
      isArchived: false,
      publishedDate: "2024-02-10T09:15:00Z",
      lastUpdated: "2024-12-01T16:20:00Z"
    },
    
    media: {
      thumbnail: "https://example.com/images/wd202-thumb.jpg",
      coverImage: "https://example.com/images/wd202-cover.jpg",
      promoVideo: "https://example.com/videos/wd202-promo.mp4"
    },
    
    metadata: {
      createdBy: "ADMIN002",
      createdAt: "2024-02-10T09:15:00Z",
      updatedBy: "ADMIN002",
      updatedAt: "2024-12-01T16:20:00Z",
      version: "3.0"
    }
  },
  
  {
    courseCode: "DS301",
    title: "Data Science with Python",
    subtitle: "From Data Analysis to Machine Learning",
    description: "Comprehensive introduction to data science covering data analysis, visualization, statistical modeling, and machine learning using Python libraries like pandas, matplotlib, seaborn, and scikit-learn.",
    shortDescription: "Master data science and machine learning with Python",
    
    instructor: {
      name: "Dr. Emily Rodriguez",
      title: "Data Scientist & ML Engineer",
      bio: "Former Google data scientist with expertise in ML and AI",
      avatar: "https://example.com/avatars/emily-rodriguez.jpg",
      email: "emily.rodriguez@example.com",
      rating: 4.8
    },
    
    category: "Data Science",
    subcategory: "Machine Learning",
    level: "Intermediate",
    language: "English",
    subtitles: ["English", "Spanish", "Mandarin"],
    duration: {
      hours: 84,
      weeks: 14,
      hoursPerWeek: 6
    },
    
    pricing: {
      amount: 399.99,
      currency: "USD",
      discountPrice: 299.99,
      discountPercentage: 25,
      discountExpiry: "2025-02-01T23:59:59Z"
    },
    
    enrollment: {
      totalStudents: 2103,
      capacity: 400,
      currentEnrollment: 378,
      status: "open",
      startDate: "2025-01-20T00:00:00Z",
      endDate: "2025-04-30T23:59:59Z",
      enrollmentDeadline: "2025-01-18T23:59:59Z",
      waitlistAvailable: true
    },
    
    ratings: {
      average: 4.8,
      total: 642,
      distribution: {
        5: 492,
        4: 118,
        3: 22,
        2: 7,
        1: 3
      }
    },
    
    curriculum: [
      {
        moduleId: "MOD020",
        title: "Python for Data Analysis",
        description: "Master pandas and data manipulation",
        order: 1,
        duration: 720,
        lessons: []
      },
      {
        moduleId: "MOD021",
        title: "Data Visualization",
        description: "Create compelling visualizations",
        order: 2,
        duration: 600,
        lessons: []
      }
    ],
    
    prerequisites: {
      required: ["Python Programming Basics", "Basic Statistics"],
      recommended: ["Linear Algebra", "Calculus"]
    },
    
    learningOutcomes: [
      "Perform exploratory data analysis with pandas",
      "Create professional data visualizations",
      "Build predictive models with scikit-learn",
      "Handle data cleaning and preprocessing",
      "Apply statistical methods to real datasets",
      "Deploy machine learning models"
    ],
    
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Scikit-learn",
      "Machine Learning",
      "Data Analysis",
      "Statistics"
    ],
    
    tags: ["data-science", "python", "machine-learning", "analytics", "pandas", "ml"],
    
    requirements: {
      software: ["Python 3.x", "Jupyter Notebook", "Anaconda"],
      hardware: ["Computer with 8GB+ RAM"],
      other: ["Basic Python knowledge", "Understanding of statistics"]
    },
    
    targetAudience: [
      "Aspiring data scientists",
      "Business analysts wanting to level up",
      "Software developers transitioning to data science",
      "Students in STEM fields"
    ],
    
    certificate: {
      available: true,
      type: "verified",
      criteria: {
        minimumScore: 75,
        completionRate: 85,
        projectSubmissions: true
      }
    },
    
    materials: {
      videos: 65,
      readings: 30,
      quizzes: 14,
      assignments: 10,
      projects: 3,
      downloadableResources: 52
    },
    
    features: {
      lifetimeAccess: true,
      mobileAccess: true,
      discussionForum: true,
      liveQA: true,
      peerReview: true,
      offlineViewing: true,
      closedCaptions: true,
      certificateOfCompletion: true
    },
    
    status: {
      isPublished: true,
      isDraft: false,
      isFeatured: false,
      isArchived: false,
      publishedDate: "2024-03-05T11:00:00Z",
      lastUpdated: "2024-11-28T10:30:00Z"
    },
    
    media: {
      thumbnail: "https://example.com/images/ds301-thumb.jpg",
      coverImage: "https://example.com/images/ds301-cover.jpg",
      promoVideo: "https://example.com/videos/ds301-promo.mp4"
    },
    
    metadata: {
      createdBy: "ADMIN003",
      createdAt: "2024-03-05T11:00:00Z",
      updatedBy: "ADMIN003",
      updatedAt: "2024-11-28T10:30:00Z",
      version: "2.5"
    }
  }
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = lmsCourses;
}

if (typeof window !== 'undefined') {
  // attach to globalThis to avoid TypeScript window typing errors when imported in Node
  (globalThis as unknown as { lmsCoursesData?: unknown }).lmsCoursesData = lmsCourses;
}