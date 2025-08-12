// Configuration file for the Grade Prediction app
export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://192.168.60.104:5000/api',
    TIMEOUT: 10000, // 10 seconds
    HEALTH_CHECK_TIMEOUT: 5000, // 5 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000, // 2 seconds
  },
  
  // Storage Configuration
  STORAGE: {
    KEYS: {
      STUDENT_DATA: 'studentData',
      PREDICTION_HISTORY: 'predictionHistory',
    },
    RETRY_ATTEMPTS: 3,
  },
  
  // Grade Configuration
  GRADES: {
    MIN_GPA: 0.0,
    MAX_GPA: 4.0,
    MIN_CREDITS: 1,
    MAX_CREDITS: 6,
  },
  
  // Prediction Configuration
  PREDICTION: {
    MIN_CONFIDENCE: 50,
    MAX_CONFIDENCE: 95,
    BASE_CONFIDENCE: 70,
  },
  
  // Validation Configuration
  VALIDATION: {
    MIN_COURSE_NAME_LENGTH: 1,
    MAX_COURSE_NAME_LENGTH: 100,
    MIN_STUDY_HOURS: 0,
    MAX_STUDY_HOURS: 168, // 24 * 7 hours per week
    MIN_ATTENDANCE: 0,
    MAX_ATTENDANCE: 100,
  },
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  CONFIG.API.BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
}

if (process.env.NODE_ENV === 'production') {
  CONFIG.API.BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-production-api.com/api';
}
