import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MLContext = createContext();

export function MLProvider({ children }) {
  const [studentData, setStudentData] = useState({
    currentGpa: 0,
    currentCwa: 0,
    totalCredits: 0,
    grades: [],
    academicHistory: [],
  });
  
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelPerformance, setModelPerformance] = useState({});
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // API base URL - should be configurable
  const API_BASE_URL = 'http://192.168.60.104:5000/api'; // Using local network IP for mobile/emulator access

  // Load data from storage on app start
  useEffect(() => {
    loadStoredData();
    checkAPIHealth();
  }, []);

  // Load stored data from AsyncStorage
  const loadStoredData = async () => {
    try {
      // Load student data
      const storedStudentData = await AsyncStorage.getItem('studentData');
      if (storedStudentData) {
        const parsedData = JSON.parse(storedStudentData);
        setStudentData(parsedData);
      }

      // Load prediction history
      const storedPredictions = await AsyncStorage.getItem('predictionHistory');
      if (storedPredictions) {
        const parsedPredictions = JSON.parse(storedPredictions);
        setPredictionHistory(parsedPredictions);
        setPredictions(parsedPredictions);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Save data to storage
  const saveDataToStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  // Helper function to get grade points
  const getGradePoints = (grade) => {
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    return gradePoints[grade] || 0.0;
  };

  // Fetch student data from backend API
  useEffect(() => {
    if (backendAvailable) {
      async function fetchStudentData() {
        try {
          const response = await fetch(`${API_BASE_URL}/student-data`);
          const data = await response.json();
          setStudentData(data);
        } catch (error) {
          console.error('Failed to fetch student data:', error);
        }
      }
      fetchStudentData();
    }
  }, [backendAvailable]);

  // Fetch model performance metrics
  useEffect(() => {
    if (backendAvailable) {
      async function fetchModelPerformance() {
        try {
          const response = await fetch(`${API_BASE_URL}/models/performance`);
          const data = await response.json();
          setModelPerformance(data);
        } catch (error) {
          console.error('Failed to fetch model performance:', error);
        }
      }
      fetchModelPerformance();
    }
  }, [backendAvailable]);

  // Function to check API health
  async function checkAPIHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000, // 5 second timeout
      });
      if (response.ok) {
        setBackendAvailable(true);
      } else {
        setBackendAvailable(false);
      }
    } catch (error) {
      console.log('Backend not available, using fallback mode');
      setBackendAvailable(false);
    }
  }

  // Function to generate prediction by calling backend API or using fallback
  async function generatePrediction(predictionData) {
    setLoading(true);
    try {
      if (backendAvailable) {
        // Try backend first
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(predictionData),
        });
        
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
        };
        
        const newPredictions = [predictionWithMetadata, ...predictions];
        const newPredictionHistory = [predictionWithMetadata, ...predictionHistory];
        
        setCurrentPrediction(predictionWithMetadata);
        setPredictions(newPredictions);
        setPredictionHistory(newPredictionHistory);
        
        // Save to storage
        await saveDataToStorage('predictionHistory', newPredictionHistory);
        
        setLoading(false);
        return predictionWithMetadata;
      } else {
        // Fallback prediction using simple algorithm
        return generateFallbackPrediction(predictionData);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback to simple prediction
      return generateFallbackPrediction(predictionData);
    } finally {
      setLoading(false);
    }
  }

  // Fallback prediction function
  async function generateFallbackPrediction(predictionData) {
    const { current_gpa, previous_gpa, study_hours, attendance, courses } = predictionData;
    
    // Simple prediction algorithm
    let baseScore = parseFloat(current_gpa) || 3.0;
    
    // Adjust based on study hours
    if (study_hours) {
      const hours = parseFloat(study_hours);
      if (hours > 20) baseScore += 0.2;
      else if (hours > 15) baseScore += 0.1;
      else if (hours < 10) baseScore -= 0.1;
    }
    
    // Adjust based on attendance
    if (attendance) {
      const attendanceRate = parseFloat(attendance);
      if (attendanceRate > 90) baseScore += 0.15;
      else if (attendanceRate > 80) baseScore += 0.1;
      else if (attendanceRate < 70) baseScore -= 0.1;
    }
    
    // Adjust based on course performance
    if (courses && courses.length > 0) {
      const avgGrade = courses.reduce((sum, course) => sum + parseFloat(course.grade || 0), 0) / courses.length;
      if (avgGrade > 80) baseScore += 0.1;
      else if (avgGrade < 60) baseScore -= 0.1;
    }
    
    // Ensure score is within valid range
    const predictedGpa = Math.max(0, Math.min(4.0, baseScore));
    
    const predictionWithMetadata = {
      predicted_gpa: predictedGpa,
      confidence: 75, // Medium confidence for fallback
      insights: [
        'This prediction is based on a simplified algorithm.',
        'For more accurate predictions, ensure the backend server is running.',
        'Consider your study habits and attendance for better results.'
      ],
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputData: predictionData,
      isFallback: true,
    };
    
    const newPredictions = [predictionWithMetadata, ...predictions];
    const newPredictionHistory = [predictionWithMetadata, ...predictionHistory];
    
    setCurrentPrediction(predictionWithMetadata);
    setPredictions(newPredictions);
    setPredictionHistory(newPredictionHistory);
    
    // Save to storage
    await saveDataToStorage('predictionHistory', newPredictionHistory);
    
    return predictionWithMetadata;
  }

  // Function to add a grade
  async function addGrade(gradeData) {
    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/add-grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gradeData),
        });
        const updatedData = await response.json();
        setStudentData(updatedData);
        return updatedData;
      } else {
        // Fallback: update local state and save to storage
        const updatedStudentData = {
          ...studentData,
          grades: [...studentData.grades, gradeData],
          totalCredits: studentData.totalCredits + (gradeData.credits || 0)
        };
        
        // Calculate new GPA and CWA
        const totalPoints = updatedStudentData.grades.reduce((sum, grade) => {
          const gradePoints = getGradePoints(grade.grade);
          return sum + (gradePoints * (grade.credits || 0));
        }, 0);
        
        const totalCredits = updatedStudentData.grades.reduce((sum, grade) => sum + (grade.credits || 0), 0);
        
        if (totalCredits > 0) {
          updatedStudentData.currentGpa = parseFloat((totalPoints / totalCredits).toFixed(2));
          updatedStudentData.currentCwa = parseFloat(((totalPoints / totalCredits) * 25).toFixed(1));
        }
        
        setStudentData(updatedStudentData);
        await saveDataToStorage('studentData', updatedStudentData);
        
        return { success: true, message: 'Grade added locally' };
      }
    } catch (error) {
      console.error('Failed to add grade:', error);
      throw error;
    }
  }

  // Function to retrain models
  async function retrainModels() {
    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/models/retrain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        
        // Refresh model performance after retraining
        const perfResponse = await fetch(`${API_BASE_URL}/models/performance`);
        const newPerformance = await perfResponse.json();
        setModelPerformance(newPerformance);
        
        return result;
      } else {
        return { success: false, message: 'Backend not available for retraining' };
      }
    } catch (error) {
      console.error('Failed to retrain models:', error);
      throw error;
    }
  }

  // Function to get prediction insights
  function getPredictionInsights(prediction) {
    if (!prediction) return [];
    
    const insights = [];
    const gpa = prediction.predicted_gpa;
    
    if (gpa >= 3.5) {
      insights.push('Excellent academic performance! Keep up the great work.');
      insights.push('Consider applying for honors programs or scholarships.');
    } else if (gpa >= 3.0) {
      insights.push('Good academic standing. Focus on maintaining consistency.');
      insights.push('Consider joining study groups for collaborative learning.');
    } else if (gpa >= 2.5) {
      insights.push('You\'re on the right track. Focus on improving study habits.');
      insights.push('Consider seeking academic support or tutoring.');
    } else {
      insights.push('Focus on improving study strategies and time management.');
      insights.push('Consider meeting with academic advisors for guidance.');
    }
    
    return insights;
  }

  // Function to calculate GPA trend
  function calculateGPATrend(predictions) {
    if (predictions.length < 2) return 'stable';
    
    const recent = predictions.slice(0, 3);
    const avgRecent = recent.reduce((sum, p) => sum + p.predicted_gpa, 0) / recent.length;
    const avgOlder = predictions.slice(3, 6).reduce((sum, p) => sum + p.predicted_gpa, 0) / Math.max(1, predictions.length - 3);
    
    if (avgRecent > avgOlder + 0.1) return 'improving';
    if (avgRecent < avgOlder - 0.1) return 'declining';
    return 'stable';
  }

  // Function to get academic recommendations
  function getAcademicRecommendations(prediction) {
    const recommendations = [];
    const gpa = prediction.predicted_gpa;
    
    if (gpa < 3.0) {
      recommendations.push('Increase study hours to at least 20 hours per week');
      recommendations.push('Improve attendance to above 85%');
      recommendations.push('Seek help from professors during office hours');
    } else if (gpa < 3.5) {
      recommendations.push('Maintain consistent study schedule');
      recommendations.push('Participate more actively in class discussions');
      recommendations.push('Form study groups with classmates');
    } else {
      recommendations.push('Consider taking advanced courses');
      recommendations.push('Explore research opportunities');
      recommendations.push('Mentor other students');
    }
    
    return recommendations;
  }

  // Function to export prediction data
  function exportPredictionData(prediction) {
    if (!prediction) return null;
    
    return {
      prediction_id: prediction.id,
      timestamp: prediction.timestamp,
      predicted_gpa: prediction.predicted_gpa,
      confidence: prediction.confidence,
      input_data: prediction.inputData,
      insights: prediction.insights,
      export_date: new Date().toISOString(),
    };
  }

  // Function to delete predictions
  const deletePredictions = async (predictionIds) => {
    try {
      const updatedPredictions = predictionHistory.filter(pred => !predictionIds.includes(pred.id));
      setPredictionHistory(updatedPredictions);
      setPredictions(updatedPredictions);
      await saveDataToStorage('predictionHistory', updatedPredictions);
      return { success: true };
    } catch (error) {
      console.error('Error deleting predictions:', error);
      throw error;
    }
  };

  // Function to delete grades
  const deleteGrades = async (gradeIds) => {
    try {
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
      
      setStudentData(updatedStudentData);
      await saveDataToStorage('studentData', updatedStudentData);
      return { success: true };
    } catch (error) {
      console.error('Error deleting grades:', error);
      throw error;
    }
  };

  const value = {
    studentData,
    predictions,
    loading,
    modelPerformance,
    currentPrediction,
    predictionHistory,
    backendAvailable,
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
  };

  return (
    <MLContext.Provider value={value}>
      {children}
    </MLContext.Provider>
  );
}

export function useML() {
  const context = useContext(MLContext);
  if (!context) {
    throw new Error('useML must be used within an MLProvider');
  }
  return context;
}
