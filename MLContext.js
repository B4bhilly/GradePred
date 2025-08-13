/**
 * MLContext - React Context for Machine Learning grade prediction functionality
 * Provides state management and functions for student data, predictions, and ML operations
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from './config';
import { 
  generateHash, 
  generateChecksum, 
  verifyDataIntegrity, 
  generateGradeHash, 
  generatePredictionHash,
  generateBatchHash,
  verifyHash 
} from './utils/hashing';

const MLContext = createContext();

/**
 * Enhanced grade points mapping with validation
 * Maps letter grades to numerical grade points
 */
const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

/**
 * Validates grade data before processing
 * @param {Object} gradeData - The grade data to validate
 * @param {string} gradeData.courseName - Course name
 * @param {string} gradeData.grade - Letter grade
 * @param {number} gradeData.credits - Credit hours
 * @returns {Array<string>} Array of validation error messages
 */
const validateGradeData = (gradeData) => {
  const errors = [];
  
  if (!gradeData.courseName?.trim() || 
      gradeData.courseName.trim().length < CONFIG.VALIDATION.MIN_COURSE_NAME_LENGTH ||
      gradeData.courseName.trim().length > CONFIG.VALIDATION.MAX_COURSE_NAME_LENGTH) {
    errors.push('Course name is required and must be between 1 and 100 characters');
  }
  
  if (!gradeData.grade || !GRADE_POINTS.hasOwnProperty(gradeData.grade)) {
    errors.push('Valid grade is required');
  }
  
  if (!gradeData.credits || isNaN(parseInt(gradeData.credits)) || 
      parseInt(gradeData.credits) < CONFIG.GRADES.MIN_CREDITS || 
      parseInt(gradeData.credits) > CONFIG.GRADES.MAX_CREDITS) {
    errors.push(`Credits must be between ${CONFIG.GRADES.MIN_CREDITS} and ${CONFIG.GRADES.MAX_CREDITS}`);
  }
  
  return errors;
};

/**
 * Validates prediction data before processing
 * @param {Object} predictionData - The prediction data to validate
 * @param {number} predictionData.current_gpa - Current GPA
 * @param {number} predictionData.previous_gpa - Previous GPA
 * @param {number} predictionData.study_hours - Study hours per week
 * @param {number} predictionData.attendance - Attendance percentage
 * @param {Array<Object>} predictionData.courses - Array of course objects
 * @returns {Array<string>} Array of validation error messages
 */
const validatePredictionData = (predictionData) => {
  const errors = [];
  
  if (!predictionData.current_gpa || isNaN(parseFloat(predictionData.current_gpa))) {
    errors.push('Current GPA is required and must be a number');
  }
  
  if (predictionData.current_gpa < CONFIG.GRADES.MIN_GPA || predictionData.current_gpa > CONFIG.GRADES.MAX_GPA) {
    errors.push(`Current GPA must be between ${CONFIG.GRADES.MIN_GPA} and ${CONFIG.GRADES.MAX_GPA}`);
  }
  
  if (predictionData.study_hours && 
      (parseFloat(predictionData.study_hours) < CONFIG.VALIDATION.MIN_STUDY_HOURS || 
       parseFloat(predictionData.study_hours) > CONFIG.VALIDATION.MAX_STUDY_HOURS)) {
    errors.push(`Study hours must be between ${CONFIG.VALIDATION.MIN_STUDY_HOURS} and ${CONFIG.VALIDATION.MAX_STUDY_HOURS}`);
  }
  
  if (predictionData.attendance && 
      (parseFloat(predictionData.attendance) < CONFIG.VALIDATION.MIN_ATTENDANCE || 
       parseFloat(predictionData.attendance) > CONFIG.VALIDATION.MAX_ATTENDANCE)) {
    errors.push(`Attendance must be between ${CONFIG.VALIDATION.MIN_ATTENDANCE} and ${CONFIG.VALIDATION.MAX_ATTENDANCE}%`);
  }
  
  return errors;
};

/**
 * MLProvider - React Context Provider for ML functionality
 * Manages state for student data, predictions, and ML operations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Context provider component
 */
export function MLProvider({ children }) {
  const [studentData, setStudentData] = useState({
    currentGpa: 0,
    currentCwa: 0,
    totalCredits: 0,
    grades: [],
    academicHistory: [],
    lastUpdated: null,
  });
  
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelPerformance, setModelPerformance] = useState({});
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [error, setError] = useState(null);

  // API base URL - should be configurable
  const API_BASE_URL = CONFIG.API.BASE_URL;

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
    setNetworkError(null);
  }, []);

  // Enhanced data loading with error handling
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      try {
        if (isMounted) {
          await loadStoredData();
          await checkAPIHealth();
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error initializing data:', error);
          setError(error.message);
        }
      }
    };
    
    initializeData();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);

  // Load stored data from AsyncStorage with enhanced error handling and hashing
  const loadStoredData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load student data with integrity check
      const storedStudentData = await AsyncStorage.getItem(CONFIG.STORAGE.KEYS.STUDENT_DATA);
      const storedChecksum = await AsyncStorage.getItem('gradesChecksum');
      
      if (storedStudentData) {
        const parsedData = JSON.parse(storedStudentData);
        
        // Validate data integrity with checksum if available
        if (parsedData && typeof parsedData === 'object' && storedChecksum && parsedData.grades?.length > 0) {
          try {
            const currentChecksum = await generateBatchHash(parsedData.grades);
            if (currentChecksum !== storedChecksum) {
              console.warn('Data integrity check failed - checksum mismatch');
              
              // Attempt to recover individual grade hashes
              const validGrades = [];
              for (const grade of parsedData.grades) {
                if (grade.dataHash) {
                  const isValid = await verifyHash(grade, grade.dataHash);
                  if (isValid) {
                    validGrades.push(grade);
                  } else {
                    console.warn(`Grade ${grade.id} failed integrity check`);
                  }
                } else {
                  // Grade without hash - validate basic structure
                  if (validateGradeData(grade).length === 0) {
                    validGrades.push(grade);
                  }
                }
              }
              
              // Update data with valid grades only
              parsedData.grades = validGrades;
              if (validGrades.length !== parsedData.grades.length) {
                console.warn(`${parsedData.grades.length - validGrades.length} grades failed integrity check`);
              }
            }
          } catch (hashError) {
            console.warn('Hash verification failed, using basic validation:', hashError);
          }
        }
        
        // Validate loaded data
        if (parsedData && typeof parsedData === 'object') {
          setStudentData({
            ...parsedData,
            lastUpdated: parsedData.lastUpdated || new Date().toISOString()
          });
        }
      }

      // Load prediction history with integrity check
      const storedPredictions = await AsyncStorage.getItem(CONFIG.STORAGE.KEYS.PREDICTION_HISTORY);
      if (storedPredictions) {
        const parsedPredictions = JSON.parse(storedPredictions);
        if (Array.isArray(parsedPredictions)) {
          // Validate prediction integrity
          const validPredictions = [];
          for (const prediction of parsedPredictions) {
            if (prediction.dataHash) {
              try {
                const isValid = await verifyHash(prediction, prediction.dataHash);
                if (isValid) {
                  validPredictions.push(prediction);
                } else {
                  console.warn(`Prediction ${prediction.id} failed integrity check`);
                }
              } catch (hashError) {
                console.warn(`Hash verification failed for prediction ${prediction.id}:`, hashError);
                // Include prediction if hash verification fails
                validPredictions.push(prediction);
              }
            } else {
              // Prediction without hash - validate basic structure
              if (prediction.predicted_gpa && prediction.timestamp) {
                validPredictions.push(prediction);
              }
            }
          }
          
          if (validPredictions.length !== parsedPredictions.length) {
            console.warn(`${parsedPredictions.length - validPredictions.length} predictions failed integrity check`);
          }
          
          setPredictionHistory(validPredictions);
          setPredictions(validPredictions);
        }
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      // Reset to default state on corruption
      setStudentData({
        currentGpa: 0,
        currentCwa: 0,
        totalCredits: 0,
        grades: [],
        academicHistory: [],
        lastUpdated: new Date().toISOString(),
      });
      setPredictionHistory([]);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, [validateGradeData]);

  // Enhanced data saving with error handling and retry logic
  const saveDataToStorage = useCallback(async (key, data, retryCount = 0) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      setNetworkError(null);
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      
      // Retry logic for storage errors
      if (retryCount < CONFIG.STORAGE.RETRY_ATTEMPTS) {
        setTimeout(() => {
          saveDataToStorage(key, data, retryCount + 1);
        }, 1000 * (retryCount + 1));
      } else {
        setNetworkError(`Failed to save ${key} after multiple attempts`);
      }
    }
  }, []);

  // Enhanced grade points helper with validation
  const getGradePoints = useCallback((grade) => {
    if (!grade || !GRADE_POINTS.hasOwnProperty(grade)) {
      console.warn(`Invalid grade: ${grade}`);
      return 0.0;
    }
    return GRADE_POINTS[grade];
  }, []);

  // Enhanced student data update with validation
  const updateStudentDataFromPrediction = useCallback(async (predictionData) => {
    try {
      const validationErrors = validatePredictionData(predictionData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const { current_gpa, currentCwa, courses, credit_hours } = predictionData;
      
      // Convert grade percentages to letter grades for courses with validation
      const processedCourses = courses?.filter(course => 
        course.name && course.grade && course.credit && 
        !isNaN(parseFloat(course.grade)) && !isNaN(parseInt(course.credit)))
        .map(course => ({
          id: Date.now() + Math.random(),
          courseName: course.name.trim(),
          grade: convertPercentageToGrade(parseFloat(course.grade)),
          credits: parseInt(course.credit),
          timestamp: new Date().toISOString(),
          source: 'prediction'
        })) || [];

      // Merge with existing grades (avoid duplicates)
      const existingCourseNames = studentData.grades.map(g => g.courseName.toLowerCase());
      const newCourses = processedCourses.filter(course => 
        !existingCourseNames.includes(course.courseName.toLowerCase())
      );

      const allGrades = [...studentData.grades, ...newCourses];
      
      // Calculate totals with validation
      const totalCredits = allGrades.reduce((sum, grade) => sum + (grade.credits || 0), 0);
      const totalPoints = allGrades.reduce((sum, grade) => {
        const gradePoints = getGradePoints(grade.grade);
        return sum + (gradePoints * (grade.credits || 0));
      }, 0);

      const calculatedGpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
      const calculatedCwa = calculatedGpa * 25;

      // Use current input if provided, otherwise use calculated values
      const updatedStudentData = {
        ...studentData,
        currentGpa: current_gpa ? parseFloat(current_gpa) : calculatedGpa,
        currentCwa: currentCwa ? parseFloat(currentCwa) : calculatedCwa,
        totalCredits: credit_hours ? parseInt(credit_hours) : totalCredits,
        grades: allGrades,
        lastUpdated: new Date().toISOString()
      };

      setStudentData(updatedStudentData);
      await saveDataToStorage(CONFIG.STORAGE.KEYS.STUDENT_DATA, updatedStudentData);
      
      return updatedStudentData;
    } catch (error) {
      console.error('Error updating student data:', error);
      throw error;
    }
  }, [studentData, getGradePoints, saveDataToStorage]);

  // Enhanced percentage to grade conversion with validation
  const convertPercentageToGrade = useCallback((percentage) => {
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      console.warn(`Invalid percentage: ${percentage}`);
      return 'F';
    }
    
    if (percentage >= 93) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 87) return 'A-';
    if (percentage >= 83) return 'B+';
    if (percentage >= 80) return 'B';
    if (percentage >= 77) return 'B-';
    if (percentage >= 73) return 'C+';
    if (percentage >= 70) return 'C';
    if (percentage >= 67) return 'C-';
    if (percentage >= 63) return 'D+';
    if (percentage >= 60) return 'D';
    return 'F';
  }, []);

  // Enhanced API health check with timeout and retry
  const checkAPIHealth = useCallback(async (retryCount = 0) => {
    let isMounted = true;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.HEALTH_CHECK_TIMEOUT);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (isMounted) {
        if (response.ok) {
          setBackendAvailable(true);
          setNetworkError(null);
          setLastSyncTime(new Date().toISOString());
        } else {
          setBackendAvailable(false);
          setNetworkError(`Backend responded with status: ${response.status}`);
        }
      }
    } catch (error) {
      if (isMounted) {
        if (error.name === 'AbortError') {
          setNetworkError('Backend connection timeout');
        } else {
          setNetworkError(`Network error: ${error.message}`);
        }
        
        setBackendAvailable(false);
      }
      
      // Retry logic for network issues
      if (retryCount < CONFIG.API.RETRY_ATTEMPTS && isMounted) {
        setTimeout(() => {
          checkAPIHealth(retryCount + 1);
        }, CONFIG.API.RETRY_DELAY * (retryCount + 1));
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [API_BASE_URL]);

  // Enhanced prediction generation with better error handling
  const generatePrediction = useCallback(async (predictionData) => {
    setLoading(true);
    setNetworkError(null);
    
    try {
      // Validate input data
      const validationErrors = validatePredictionData(predictionData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Update student data based on prediction input
      await updateStudentDataFromPrediction(predictionData);
      
      if (backendAvailable) {
        // Try backend first with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);
        
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(predictionData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Add timestamp and prediction ID
        const predictionWithMetadata = {
          ...result,
          id: Date.now(),
          timestamp: new Date().toISOString(),
          inputData: predictionData,
          source: 'backend'
        };

        // Generate hash for prediction data integrity
        const predictionHash = await generatePredictionHash(predictionWithMetadata);
        predictionWithMetadata.dataHash = predictionHash;
        
        const newPredictions = [predictionWithMetadata, ...predictions];
        const newPredictionHistory = [predictionWithMetadata, ...predictionHistory];
        
        setCurrentPrediction(predictionWithMetadata);
        setPredictions(newPredictions);
        setPredictionHistory(newPredictionHistory);
        
        // Save to storage
        await saveDataToStorage(CONFIG.STORAGE.KEYS.PREDICTION_HISTORY, newPredictionHistory);
        
        setLastSyncTime(new Date().toISOString());
        return predictionWithMetadata;
      } else {
        // Fallback prediction using enhanced algorithm
        return await generateFallbackPrediction(predictionData);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setNetworkError(error.message);
      
      // Always fallback to simple prediction
      return await generateFallbackPrediction(predictionData);
    } finally {
      setLoading(false);
    }
  }, [backendAvailable, predictions, predictionHistory, updateStudentDataFromPrediction, saveDataToStorage, generateFallbackPrediction]);

  // Enhanced fallback prediction with better algorithm
  const generateFallbackPrediction = useCallback(async (predictionData) => {
    try {
      const { current_gpa, previous_gpa, study_hours, attendance, courses } = predictionData;
      
      // Enhanced prediction algorithm
      let baseScore = parseFloat(current_gpa) || 3.0;
      
      // Adjust based on study hours with more granular scoring
      if (study_hours) {
        const hours = parseFloat(study_hours);
        if (hours > 25) baseScore += 0.3;
        else if (hours > 20) baseScore += 0.2;
        else if (hours > 15) baseScore += 0.1;
        else if (hours < 10) baseScore -= 0.2;
        else if (hours < 5) baseScore -= 0.3;
      }
      
      // Adjust based on attendance with more granular scoring
      if (attendance) {
        const attendanceRate = parseFloat(attendance);
        if (attendanceRate > 95) baseScore += 0.2;
        else if (attendanceRate > 90) baseScore += 0.15;
        else if (attendanceRate > 80) baseScore += 0.1;
        else if (attendanceRate < 70) baseScore -= 0.15;
        else if (attendanceRate < 60) baseScore -= 0.25;
      }
      
      // Adjust based on course performance trend
      if (courses && courses.length > 0) {
        const avgGrade = courses.reduce((sum, course) => sum + parseFloat(course.grade || 0), 0) / courses.length;
        if (avgGrade > 85) baseScore += 0.15;
        else if (avgGrade > 75) baseScore += 0.1;
        else if (avgGrade < 65) baseScore -= 0.15;
        else if (avgGrade < 55) baseScore -= 0.25;
      }
      
      // Consider previous GPA trend
      if (previous_gpa && previous_gpa !== current_gpa) {
        const gpaChange = parseFloat(current_gpa) - parseFloat(previous_gpa);
        if (gpaChange > 0.3) baseScore += 0.1; // Improving trend
        else if (gpaChange < -0.3) baseScore -= 0.1; // Declining trend
      }
      
      // Ensure score is within valid range
      const predictedGpa = Math.max(CONFIG.GRADES.MIN_GPA, Math.min(CONFIG.GRADES.MAX_GPA, baseScore));
      
      // Calculate confidence based on data quality
      let confidence = CONFIG.PREDICTION.BASE_CONFIDENCE; // Base confidence
      if (study_hours && attendance && courses?.length > 0) confidence += 15;
      if (previous_gpa) confidence += 10;
      if (courses?.length > 2) confidence += 5;
      
      const predictionWithMetadata = {
        predicted_gpa: predictedGpa,
        confidence: Math.min(CONFIG.PREDICTION.MAX_CONFIDENCE, confidence),
        insights: generateInsights(predictedGpa),
        id: Date.now(),
        timestamp: new Date().toISOString(),
        inputData: predictionData,
        isFallback: true,
        source: 'fallback'
      };

      // Generate hash for fallback prediction data integrity
      const predictionHash = await generatePredictionHash(predictionWithMetadata);
      predictionWithMetadata.dataHash = predictionHash;
      
      const newPredictions = [predictionWithMetadata, ...predictions];
      const newPredictionHistory = [predictionWithMetadata, ...predictionHistory];
      
      setCurrentPrediction(predictionWithMetadata);
      setPredictions(newPredictions);
      setPredictionHistory(newPredictionHistory);
      
      // Save to storage
      await saveDataToStorage(CONFIG.STORAGE.KEYS.PREDICTION_HISTORY, newPredictionHistory);
      
      return predictionWithMetadata;
    } catch (error) {
      console.error('Error in fallback prediction:', error);
      throw error;
    }
  }, [predictions, predictionHistory, saveDataToStorage, generateInsights]);

  // Enhanced insights generation
  const generateInsights = useCallback((gpa) => {
    const insights = [];
    
    if (gpa >= 3.8) {
      insights.push('Exceptional academic performance! You\'re in the top tier of students.');
      insights.push('Consider applying for prestigious scholarships and honors programs.');
      insights.push('You might be ready for advanced research opportunities.');
    } else if (gpa >= 3.5) {
      insights.push('Excellent academic standing! Keep up the outstanding work.');
      insights.push('Consider applying for honors programs or research positions.');
      insights.push('You\'re well-positioned for graduate school applications.');
    } else if (gpa >= 3.0) {
      insights.push('Good academic standing. Focus on maintaining consistency.');
      insights.push('Consider joining study groups for collaborative learning.');
      insights.push('You\'re on track for most graduate programs.');
    } else if (gpa >= 2.5) {
      insights.push('You\'re making progress. Focus on improving study habits.');
      insights.push('Consider seeking academic support or tutoring.');
      insights.push('Regular attendance and study time will help improve your GPA.');
    } else {
      insights.push('Focus on fundamental study strategies and time management.');
      insights.push('Consider meeting with academic advisors for guidance.');
      insights.push('Don\'t hesitate to seek help from professors and tutors.');
    }
    
    return insights;
  }, []);

  // Enhanced grade addition with validation
  const addGrade = useCallback(async (gradeData) => {
    try {
      // Validate grade data
      const validationErrors = validateGradeData(gradeData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Generate hash for data integrity
      const gradeHash = await generateGradeHash(gradeData);
      const gradeWithHash = { ...gradeData, dataHash: gradeHash };

      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/add-grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gradeWithHash),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedData = await response.json();
        
        // Verify data integrity with hash
        if (updatedData.dataHash && !(await verifyHash(gradeData, updatedData.dataHash))) {
          console.warn('Data integrity check failed for backend response');
        }
        
        setStudentData(updatedData);
        await saveDataToStorage(CONFIG.STORAGE.KEYS.STUDENT_DATA, updatedData);
        return updatedData;
      } else {
        // Enhanced fallback: update local state and save to storage
        const updatedStudentData = {
          ...studentData,
          grades: [...studentData.grades, gradeWithHash],
          totalCredits: studentData.totalCredits + (gradeData.credits || 0),
          lastUpdated: new Date().toISOString()
        };
        
        // Recalculate GPA and CWA
        const totalPoints = updatedStudentData.grades.reduce((sum, grade) => {
          const gradePoints = getGradePoints(grade.grade);
          return sum + (gradePoints * (grade.credits || 0));
        }, 0);
        
        const totalCredits = updatedStudentData.grades.reduce((sum, grade) => sum + (grade.credits || 0), 0);
        
        if (totalCredits > 0) {
          updatedStudentData.currentGpa = parseFloat((totalPoints / totalCredits).toFixed(2));
          updatedStudentData.currentCwa = parseFloat(((totalPoints / totalCredits) * 25).toFixed(1));
        }
        
        // Generate batch checksum for all grades
        const batchChecksum = await generateBatchHash(updatedStudentData.grades);
        updatedStudentData.gradesChecksum = batchChecksum;
        
        setStudentData(updatedStudentData);
        await saveDataToStorage(CONFIG.STORAGE.KEYS.STUDENT_DATA, updatedStudentData);
        
        // Save batch checksum separately
        await AsyncStorage.setItem('gradesChecksum', batchChecksum);
        
        return { success: true, message: 'Grade added locally with integrity check', data: updatedStudentData, checksum: batchChecksum };
      }
    } catch (error) {
      console.error('Failed to add grade:', error);
      throw error;
    }
  }, [studentData, backendAvailable, getGradePoints, saveDataToStorage, API_BASE_URL]);

  // Enhanced model retraining
  const retrainModels = useCallback(async () => {
    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/models/retrain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Refresh model performance after retraining
        const perfResponse = await fetch(`${API_BASE_URL}/models/performance`);
        if (perfResponse.ok) {
          const newPerformance = await perfResponse.json();
          setModelPerformance(newPerformance);
        }
        
        return result;
      } else {
        return { success: false, message: 'Backend not available for retraining' };
      }
    } catch (error) {
      console.error('Failed to retrain models:', error);
      throw error;
    }
  }, [backendAvailable, API_BASE_URL]);

  // Enhanced prediction insights
  const getPredictionInsights = useCallback((prediction) => {
    if (!prediction) return [];
    return generateInsights(prediction.predicted_gpa);
  }, [generateInsights]);

  // Enhanced GPA trend calculation
  const calculateGPATrend = useCallback((predictions) => {
    if (!Array.isArray(predictions) || predictions.length < 2) return 'stable';
    
    try {
      const recent = predictions.slice(0, 3);
      const older = predictions.slice(3, 6);
      
      if (recent.length === 0 || older.length === 0) return 'stable';
      
      const avgRecent = recent.reduce((sum, p) => sum + (p.predicted_gpa || 0), 0) / recent.length;
      const avgOlder = older.reduce((sum, p) => sum + (p.predicted_gpa || 0), 0) / older.length;
      
      const difference = avgRecent - avgOlder;
      
      if (difference > 0.1) return 'improving';
      if (difference < -0.1) return 'declining';
      return 'stable';
    } catch (error) {
      console.error('Error calculating GPA trend:', error);
      return 'stable';
    }
  }, []);

  // Enhanced academic recommendations
  const getAcademicRecommendations = useCallback((prediction) => {
    const recommendations = [];
    const gpa = prediction?.predicted_gpa || 0;
    
    if (gpa < 2.5) {
      recommendations.push('Increase study hours to at least 25 hours per week');
      recommendations.push('Improve attendance to above 90%');
      recommendations.push('Seek help from professors during office hours');
      recommendations.push('Consider reducing course load if possible');
      recommendations.push('Join study groups for collaborative learning');
    } else if (gpa < 3.0) {
      recommendations.push('Maintain consistent study schedule of 20+ hours per week');
      recommendations.push('Improve attendance to above 85%');
      recommendations.push('Participate more actively in class discussions');
      recommendations.push('Form study groups with classmates');
      recommendations.push('Seek tutoring for challenging subjects');
    } else if (gpa < 3.5) {
      recommendations.push('Maintain consistent study schedule');
      recommendations.push('Participate more actively in class discussions');
      recommendations.push('Form study groups with classmates');
      recommendations.push('Consider taking advanced courses');
      recommendations.push('Explore research opportunities');
    } else {
      recommendations.push('Consider taking advanced or honors courses');
      recommendations.push('Explore research opportunities');
      recommendations.push('Mentor other students');
      recommendations.push('Apply for prestigious scholarships');
      recommendations.push('Consider early graduate school preparation');
    }
    
    return recommendations;
  }, []);

  // Enhanced data export with integrity verification
  const exportPredictionData = useCallback(async (prediction) => {
    if (!prediction) return null;
    
    try {
      const exportData = {
        prediction_id: prediction.id,
        timestamp: prediction.timestamp,
        predicted_gpa: prediction.predicted_gpa,
        confidence: prediction.confidence,
        input_data: prediction.inputData,
        insights: prediction.insights,
        source: prediction.source || 'unknown',
        export_date: new Date().toISOString(),
      };

      // Generate hash for export data integrity
      const exportHash = await generateHash(exportData);
      exportData.integrity_hash = exportHash;

      return exportData;
    } catch (error) {
      console.error('Error exporting prediction data:', error);
      return null;
    }
  }, []);

  // Enhanced prediction deletion
  const deletePredictions = useCallback(async (predictionIds) => {
    try {
      if (!Array.isArray(predictionIds) || predictionIds.length === 0) {
        throw new Error('No prediction IDs provided');
      }
      
      const updatedPredictions = predictionHistory.filter(pred => !predictionIds.includes(pred.id));
      setPredictionHistory(updatedPredictions);
      setPredictions(updatedPredictions);
      await saveDataToStorage(CONFIG.STORAGE.KEYS.PREDICTION_HISTORY, updatedPredictions);
      return { success: true, deletedCount: predictionIds.length };
    } catch (error) {
      console.error('Error deleting predictions:', error);
      throw error;
    }
  }, [predictionHistory, saveDataToStorage]);

  // Enhanced grade update
  const updateGrade = useCallback(async (updatedGrade) => {
    try {
      // Validate updated grade
      const validationErrors = validateGradeData(updatedGrade);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const updatedGrades = studentData.grades.map(grade => 
        grade.id === updatedGrade.id ? updatedGrade : grade
      );
      
      // Recalculate GPA, CWA, and total credits
      const totalCredits = updatedGrades.reduce((sum, grade) => sum + grade.credits, 0);
      const totalGradePoints = updatedGrades.reduce((sum, grade) => 
        sum + (getGradePoints(grade.grade) * grade.credits), 0
      );
      const currentGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
      const currentCwa = currentGpa * 25;

      const updatedStudentData = {
        ...studentData,
        grades: updatedGrades,
        currentGpa: parseFloat(currentGpa.toFixed(2)),
        currentCwa: parseFloat(currentCwa.toFixed(1)),
        totalCredits: totalCredits,
        lastUpdated: new Date().toISOString()
      };
      
      setStudentData(updatedStudentData);
      await saveDataToStorage(CONFIG.STORAGE.KEYS.STUDENT_DATA, updatedStudentData);
      
      return { success: true, data: updatedStudentData };
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  }, [studentData, getGradePoints, saveDataToStorage]);

  // Enhanced grade deletion
  const deleteGrades = useCallback(async (gradeIds) => {
    try {
      if (!Array.isArray(gradeIds) || gradeIds.length === 0) {
        throw new Error('No grade IDs provided');
      }
      
      const updatedGrades = studentData.grades.filter(grade => !gradeIds.includes(grade.id));
      const updatedStudentData = { ...studentData, grades: updatedGrades };
      
      // Recalculate GPA and CWA
      const totalPoints = updatedGrades.reduce((sum, grade) => {
        const gradePoints = getGradePoints(grade.grade);
        return sum + (gradePoints * (grade.credits || 0));
      }, 0);
      
      const totalCredits = updatedGrades.reduce((sum, grade) => sum + (grade.credits || 0), 0);
      
      if (totalCredits > 0) {
        updatedStudentData.currentGpa = parseFloat((totalPoints / totalCredits).toFixed(2));
        updatedStudentData.currentCwa = parseFloat(((totalPoints / totalCredits) * 25).toFixed(1));
        updatedStudentData.totalCredits = totalCredits;
      } else {
        updatedStudentData.currentGpa = 0;
        updatedStudentData.currentCwa = 0;
        updatedStudentData.totalCredits = 0;
      }
      
      updatedStudentData.lastUpdated = new Date().toISOString();
      
      setStudentData(updatedStudentData);
      await saveDataToStorage(CONFIG.STORAGE.KEYS.STUDENT_DATA, updatedStudentData);
      
      return { success: true, deletedCount: gradeIds.length, data: updatedStudentData };
    } catch (error) {
      console.error('Error deleting grades:', error);
      throw error;
    }
  }, [studentData, getGradePoints, saveDataToStorage]);

  // Enhanced data sync function
  const syncDataWithBackend = useCallback(async () => {
    if (!backendAvailable) {
      throw new Error('Backend not available for sync');
    }
    
    try {
      setLoading(true);
      
      // Sync student data
      const studentResponse = await fetch(`${API_BASE_URL}/student-data`);
      if (studentResponse.ok) {
        const backendData = await studentResponse.json();
        setStudentData(prev => ({ ...prev, ...backendData }));
        await saveDataToStorage(CONFIG.STORAGE.KEYS.STUDENT_DATA, backendData);
      }
      
      // Sync predictions
      const predictionsResponse = await fetch(`${API_BASE_URL}/predictions`);
      if (predictionsResponse.ok) {
        const backendPredictions = await predictionsResponse.json();
        setPredictionHistory(backendPredictions);
        setPredictions(backendPredictions);
        await saveDataToStorage(CONFIG.STORAGE.KEYS.PREDICTION_HISTORY, backendPredictions);
      }
      
      setLastSyncTime(new Date().toISOString());
      return { success: true };
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [backendAvailable, saveDataToStorage, API_BASE_URL]);

  // Memoized computed values
  const computedStats = useMemo(() => {
    const totalCourses = studentData.grades?.length || 0;
    const totalCredits = studentData.totalCredits || 0;
    const currentGpa = studentData.currentGpa || 0;
    const currentCwa = studentData.currentCwa || 0;
    
    // Calculate semester GPA if we have semester data
    const semesterGrades = studentData.grades?.filter(g => g.semester) || [];
    const semesterGpa = semesterGrades.length > 0 ? 
      semesterGrades.reduce((sum, g) => sum + (getGradePoints(g.grade) * g.credits), 0) / 
      semesterGrades.reduce((sum, g) => sum + g.credits, 0) : 0;
    
    return {
      totalCourses,
      totalCredits,
      currentGpa: parseFloat(currentGpa.toFixed(2)),
      currentCwa: parseFloat(currentCwa.toFixed(1)),
      semesterGpa: parseFloat(semesterGpa.toFixed(2)),
      averageCreditsPerCourse: totalCourses > 0 ? parseFloat((totalCredits / totalCourses).toFixed(1)) : 0
    };
  }, [studentData, getGradePoints]);

  const value = {
    studentData,
    predictions,
    loading,
    modelPerformance,
    currentPrediction,
    predictionHistory,
    backendAvailable,
    networkError,
    lastSyncTime,
    error,
    computedStats,
    generatePrediction,
    addGrade,
    retrainModels,
    checkAPIHealth,
    getPredictionInsights,
    calculateGPATrend,
    getAcademicRecommendations,
    exportPredictionData,
    deletePredictions,
    deleteGrades,
    loadStoredData,
    updateStudentDataFromPrediction,
    updateGrade,
    syncDataWithBackend,
    validateGradeData,
    validatePredictionData,
    clearError,
  };

  // Error boundary for the context
  if (error) {
    console.error('MLContext error:', error);
    // Return a fallback context with error information
    return (
      <MLContext.Provider value={{
        ...value,
        error,
        studentData: { currentGpa: 0, currentCwa: 0, totalCredits: 0, grades: [], academicHistory: [], lastUpdated: null },
        predictions: [],
        loading: false,
        backendAvailable: false,
        networkError: error,
      }}>
        {children}
      </MLContext.Provider>
    );
  }

  return (
    <MLContext.Provider value={value}>
      {children}
    </MLContext.Provider>
  );
}

/**
 * useML - Custom hook to access ML context
 * Must be used within an MLProvider
 * @returns {Object} ML context value
 * @throws {Error} If used outside of MLProvider
 */
export function useML() {
  const context = useContext(MLContext);
  if (!context) {
    throw new Error('useML must be used within an MLProvider');
  }
  return context;
}
