import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../designSystem';
import { useML } from '../../MLContext';

const CWAScreen = ({ navigation }) => {
  const { generatePrediction, loading, modelPerformance } = useML();
  
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CWA Predictor</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {!showResults ? (
          <ScrollView>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Academic Information</Text>
              <View style={styles.inputRow}>  
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Current CWA*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="E.g. 65.5"
                    keyboardType="numeric"
                    value={cwaInputs.currentCwa}
                    onChangeText={(text) => updateCwaInput('currentCwa', text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Previous Semester CWA*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="E.g. 62.0"
                    keyboardType="numeric"
                    value={cwaInputs.previousCwa}
                    onChangeText={(text) => updateCwaInput('previousCwa', text)}
                  />
                </View>
              </View>
              
                             <View style={styles.inputRow}>
                 <View style={styles.inputGroup}>
                   <Text style={styles.inputLabel}>Study Hours per Week</Text>
                   <TextInput
                     style={styles.input}
                     placeholder="E.g. 15"
                     keyboardType="numeric"
                     value={cwaInputs.studyHours}
                     onChangeText={(text) => updateCwaInput('studyHours', text)}
                   />
                 </View>
                 <View style={styles.inputGroup}>
                   <Text style={styles.inputLabel}>Attendance %</Text>
                   <TextInput
                     style={styles.input}
                     placeholder="E.g. 90"
                     keyboardType="numeric"
                     value={cwaInputs.attendance}
                     onChangeText={(text) => updateCwaInput('attendance', text)}
                   />
                 </View>
               </View>

               <View style={styles.inputRow}>
                 <View style={styles.inputGroup}>
                   <Text style={styles.inputLabel}>Assignment Submission %</Text>
                   <TextInput
                     style={styles.input}
                     placeholder="E.g. 95"
                     keyboardType="numeric"
                     value={cwaInputs.assignmentSubmission}
                     onChangeText={(text) => updateCwaInput('assignmentSubmission', text)}
                   />
                 </View>
                 <View style={styles.inputGroup}>
                   <Text style={styles.inputLabel}>Total Credits Completed</Text>
                   <TextInput
                     style={styles.input}
                     placeholder="E.g. 45"
                     keyboardType="numeric"
                     value={cwaInputs.totalCredits}
                     onChangeText={(text) => updateCwaInput('totalCredits', text)}
                   />
                 </View>
               </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Courses</Text>
              {courses.map((course, index) => (
                <View key={course.id} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseTitle}>Course {index + 1}</Text>
                    {courses.length > 1 && (
                      <TouchableOpacity onPress={() => removeCourse(course.id)} style={styles.removeButton}>
                        <Entypo name="cross" size={20} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={styles.inputLabel}>Course Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="E.g. Advanced Calculus"
                    value={course.name}
                    onChangeText={(text) => updateCourse(course.id, 'name', text)}
                  />

                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Grade</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="E.g. 75"
                        keyboardType="numeric"
                        value={course.grade}
                        onChangeText={(text) => updateCourse(course.id, 'grade', text)}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Credit Hours</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="E.g. 4"
                        keyboardType="numeric"
                        value={course.credit}
                        onChangeText={(text) => updateCourse(course.id, 'credit', text)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.resultCard}>
              <Ionicons name="analytics" size={48} color={colors.primary} />
              <Text style={styles.resultTitle}>CWA Prediction</Text>
              
              <View style={styles.predictionContainer}>
                <Text style={styles.predictionLabel}>Predicted CWA</Text>
                <Text style={styles.predictionValue}>
                  {prediction?.predicted_gpa?.toFixed(1) || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence Level</Text>
                <Text style={styles.confidenceValue}>{prediction?.confidence || 0}%</Text>
              </View>
              
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>Academic Insights</Text>
                {prediction?.insights?.map((insight, index) => (
                  <Text key={index} style={styles.insightsText}>• {insight}</Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      {!showResults && (
        <TouchableOpacity onPress={addCourse} style={styles.fab}>
          <FontAwesome5 name="plus" size={20} color={colors.background} />
        </TouchableOpacity>
      )}
      
      <View style={styles.buttonContainer}>
        {!showResults ? (
          <TouchableOpacity 
            onPress={handlePredictCWA} 
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>Predict CWA</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={resetForm} style={styles.button}>
            <Text style={styles.buttonText}>New Prediction</Text>
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
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  courseCard: {
    backgroundColor: colors.backgroundSecondary,
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
    color: colors.textPrimary,
  },
  removeButton: {
    padding: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.base,
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
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
    color: colors.background,
    fontWeight: typography.semibold,
    fontSize: typography.base,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: typography.semibold,
    fontSize: typography.base,
  },
  resultsContainer: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  resultCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  resultTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  predictionContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  predictionLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  predictionValue: {
    fontSize: typography['4xl'],
    fontWeight: typography.bold,
    color: colors.primary,
  },
  confidenceContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  confidenceLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  confidenceValue: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.primary,
  },
  insightsContainer: {
    width: '100%',
  },
  insightsTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  insightsText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
});