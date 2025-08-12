import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { typography, spacing, borderRadius, shadows } from '../../designSystem';
import { useML } from '../../MLContext';
import { useTheme } from '../../ThemeContext';

const CWAScreen = ({ navigation }) => {
  const { generatePrediction, loading, modelPerformance } = useML();
  const { colors, isInitialized } = useTheme();
  const scrollViewRef = useRef();
  
  // Safety check to ensure colors are available
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  
  const [courses, setCourses] = useState([
    { id: Date.now(), name: '', grade: '', credit: '' },
  ]);
  
  const [cwaInputs, setCwaInputs] = useState({
    currentCwa: '',
    previousCwa: '',
    studyHours: '',
    attendance: '',
    assignmentSubmission: '',
    totalCredits: '',
  });
  

  
  const [prediction, setPrediction] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', grade: '', credit: '' }]);
    
    // Scroll to the new course after a short delay
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };



  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };



  const updateCourse = (id, field, value) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };



  const updateCwaInput = (field, value) => {
    setCwaInputs(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const hasValidCourse = courses.some(course => 
      course.name.trim() && course.grade.trim() && course.credit.trim()
    );
    
    if (!hasValidCourse) {
      Alert.alert('Validation Error', 'Please add at least one course with all fields filled.');
      return false;
    }
    
    if (!cwaInputs.currentCwa.trim()) {
      Alert.alert('Validation Error', 'Please enter your current CWA.');
      return false;
    }
    
    return true;
  };

  const handlePredictCWA = async () => {
    if (!validateForm()) return;
    
    try {
      const predictionData = {
        current_gpa: parseFloat(cwaInputs.currentCwa),
        previous_gpa: parseFloat(cwaInputs.previousCwa),
        study_hours: cwaInputs.studyHours ? parseFloat(cwaInputs.studyHours) : 0,
        attendance: cwaInputs.attendance ? parseFloat(cwaInputs.attendance) : 0,
        credit_hours: cwaInputs.totalCredits ? parseInt(cwaInputs.totalCredits) : 0,
        courses: courses.filter(course => course.name && course.grade && course.credit),
        prediction_type: 'cwa',
      };
      
      const result = await generatePrediction(predictionData);
      setPrediction(result);
      setShowResults(true);
    } catch (error) {
      Alert.alert('Prediction Error', 'Failed to generate CWA prediction. Please try again.');
    }
  };

  const resetForm = () => {
    setCourses([{ id: Date.now(), name: '', grade: '', credit: '' }]);
    setCwaInputs({
      currentCwa: '',
      previousCwa: '',
      studyHours: '',
      attendance: '',
      assignmentSubmission: '',
      totalCredits: '',
    });
    setPrediction(null);
    setShowResults(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>CWA Predictor</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
      >
        {!showResults ? (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Academic Information</Text>
              <View style={styles.inputRow}>  
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Current CWA*</Text>
                  <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="E.g. 65.5"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={cwaInputs.currentCwa}
                    onChangeText={(text) => updateCwaInput('currentCwa', text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Previous Semester CWA*</Text>
                  <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="E.g. 62.0"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={cwaInputs.previousCwa}
                    onChangeText={(text) => updateCwaInput('previousCwa', text)}
                  />
                </View>
              </View>
              
                             <View style={styles.inputRow}>
                 <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Study Hours per Week</Text>
                   <TextInput
                     style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                     placeholder="E.g. 15"
                     placeholderTextColor={colors.textSecondary}
                     keyboardType="numeric"
                     value={cwaInputs.studyHours}
                     onChangeText={(text) => updateCwaInput('studyHours', text)}
                   />
                 </View>
                 <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Attendance %</Text>
                   <TextInput
                     style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                     placeholder="E.g. 90"
                     placeholderTextColor={colors.textSecondary}
                     keyboardType="numeric"
                     value={cwaInputs.attendance}
                     onChangeText={(text) => updateCwaInput('attendance', text)}
                   />
                 </View>
               </View>

               <View style={styles.inputRow}>
                 <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Assignment Submission %</Text>
                   <TextInput
                     style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                     placeholder="E.g. 95"
                     placeholderTextColor={colors.textSecondary}
                     keyboardType="numeric"
                     value={cwaInputs.assignmentSubmission}
                     onChangeText={(text) => updateCwaInput('assignmentSubmission', text)}
                   />
                 </View>
                 <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Total Credits Completed</Text>
                   <TextInput
                     style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                     placeholder="E.g. 45"
                     placeholderTextColor={colors.textSecondary}
                     keyboardType="numeric"
                     value={cwaInputs.totalCredits}
                     onChangeText={(text) => updateCwaInput('totalCredits', text)}
                   />
                 </View>
               </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Current Courses</Text>
              {courses.map((course, index) => (
                <View key={course.id} style={[styles.courseCard, { backgroundColor: colors.backgroundSecondary }]}>
                  <View style={styles.courseHeader}>
                    <Text style={[styles.courseTitle, { color: colors.textPrimary }]}>Course {index + 1}</Text>
                    {courses.length > 1 && (
                      <TouchableOpacity onPress={() => removeCourse(course.id)} style={styles.removeButton}>
                        <Entypo name="cross" size={20} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Course Name</Text>
                  <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="E.g. Advanced Calculus"
                    placeholderTextColor={colors.textSecondary}
                    value={course.name}
                    onChangeText={(text) => updateCourse(course.id, 'name', text)}
                  />

                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Grade</Text>
                      <TextInput
                        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                        placeholder="E.g. 75"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        value={course.grade}
                        onChangeText={(text) => updateCourse(course.id, 'grade', text)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Credit Hours</Text>
                      <TextInput
                        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
                        placeholder="E.g. 4"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        value={course.credit}
                        onChangeText={(text) => updateCourse(course.id, 'credit', text)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={[styles.resultCard, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="analytics" size={48} color={colors.primary} />
              <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>CWA Prediction</Text>
              
              <View style={styles.predictionContainer}>
                <Text style={[styles.predictionLabel, { color: colors.textSecondary }]}>Predicted CWA</Text>
                <Text style={[styles.predictionValue, { color: colors.textPrimary }]}>
                  {prediction?.predicted_gpa ? (prediction.predicted_gpa * 25).toFixed(1) : 'N/A'}
                </Text>
              </View>
              
              <View style={styles.confidenceContainer}>
                <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>Confidence Level</Text>
                <Text style={[styles.confidenceValue, { color: colors.textPrimary }]}>{prediction?.confidence || 0}%</Text>
              </View>
              
              <View style={styles.insightsContainer}>
                <Text style={[styles.insightsTitle, { color: colors.textPrimary }]}>Academic Insights</Text>
                {prediction?.insights?.map((insight, index) => (
                  <Text key={index} style={[styles.insightsText, { color: colors.textSecondary }]}>• {insight}</Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      {!showResults && (
        <TouchableOpacity onPress={addCourse} style={[styles.fab, { backgroundColor: colors.primary }]}>
          <FontAwesome5 name="plus" size={20} color={colors.background} />
        </TouchableOpacity>
      )}
      
      <View style={styles.buttonContainer}>
        {!showResults ? (
          <TouchableOpacity 
            onPress={handlePredictCWA} 
            style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>Predict CWA</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={resetForm} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: colors.background }]}>New Prediction</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CWAScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.md,
  },
  courseCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  courseTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  removeButton: {
    padding: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.base,
    minHeight: 48,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },

  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: typography.semibold,
    fontSize: typography.base,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flex: 1,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: typography.semibold,
    fontSize: typography.base,
  },
  resultsContainer: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  resultCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  resultTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  predictionContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  predictionLabel: {
    fontSize: typography.base,
    marginBottom: spacing.xs,
  },
  predictionValue: {
    fontSize: typography['4xl'],
    fontWeight: typography.bold,
  },
  confidenceContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  confidenceLabel: {
    fontSize: typography.base,
    marginBottom: spacing.xs,
  },
  confidenceValue: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
  },
  insightsContainer: {
    width: '100%',
  },
  insightsTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
  },
  insightsText: {
    fontSize: typography.base,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
});