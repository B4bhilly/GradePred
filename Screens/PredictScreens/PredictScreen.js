import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useML } from '../../MLContext';
import { typography, spacing, borderRadius, shadows, sharedStyles } from '../../designSystem';
import { useTheme } from '../../ThemeContext';

export default function PredictScreen() {
  const { generatePrediction, studentData, loading } = useML();
  const { colors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  const [formData, setFormData] = useState({
    targetGpa: '',
    additionalCredits: '',
    studyHours: '',
    attendanceRate: '',
    academicLevel: 'undergraduate',
  });
  const [prediction, setPrediction] = useState(null);
  const [showNotification, setShowNotification] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.targetGpa || !formData.additionalCredits) {
      setShowNotification('Please fill in all required fields');
      setTimeout(() => setShowNotification(''), 3000);
      return false;
    }

    const targetGpa = parseFloat(formData.targetGpa);
    if (targetGpa < 0 || targetGpa > 4.0) {
      setShowNotification('Target GPA must be between 0.0 and 4.0');
      setTimeout(() => setShowNotification(''), 3000);
      return false;
    }

    return true;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    try {
      const predictionData = {
        currentGpa: studentData.currentGpa,
        currentCwa: studentData.currentCwa,
        totalCredits: studentData.totalCredits,
        targetGpa: parseFloat(formData.targetGpa),
        additionalCredits: parseInt(formData.additionalCredits),
        studyHours: parseFloat(formData.studyHours) || 20,
        attendanceRate: parseFloat(formData.attendanceRate) || 85,
        academicLevel: formData.academicLevel,
        semester: 'current',
        academicYear: new Date().getFullYear().toString(),
      };

      const result = await generatePrediction(predictionData);
      setPrediction(result);
      
      setShowNotification('Prediction generated successfully!');
      setTimeout(() => setShowNotification(''), 3000);
    } catch (error) {
      setShowNotification(error.message || 'Failed to generate prediction');
      setTimeout(() => setShowNotification(''), 3000);
    }
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return colors.success;
    if (gpa >= 3.0) return colors.warning;
    if (gpa >= 2.5) return colors.secondary;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      {showNotification ? (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{showNotification}</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <Text style={styles.title}>AI Prediction</Text>
        <Text style={styles.subtitle}>Get personalized GPA and CWA predictions based on your academic data</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Academic Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: getGpaColor(studentData.currentGpa) }]}>
              {studentData.currentGpa.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Current GPA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{studentData.currentCwa.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Current CWA</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.card}>
        <Text style={styles.cardTitle}>Prediction Parameters</Text>
        <View style={styles.formContainer}>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Previous GPA *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.targetGpa}
              onChangeText={(text) => handleInputChange('targetGpa', text)}
              placeholder="e.g., 3.8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target GPA *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.targetGpa}
              onChangeText={(text) => handleInputChange('targetGpa', text)}
              placeholder="e.g., 3.8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Credits to Take *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.additionalCredits}
              onChangeText={(text) => handleInputChange('additionalCredits', text)}
              placeholder="e.g., 15"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weekly Study Hours</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.studyHours}
              onChangeText={(text) => handleInputChange('studyHours', text)}
              placeholder="e.g., 25"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Expected Attendance Rate (%)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.attendanceRate}
              onChangeText={(text) => handleInputChange('attendanceRate', text)}
              placeholder="e.g., 90"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assignment Submission Rate (%)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.attendanceRate}
              onChangeText={(text) => handleInputChange('attendanceRate', text)}
              placeholder="e.g., 90"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Academic Level:</Text>
            <View style={styles.chipsContainer}>
              <TouchableOpacity
                style={[styles.chip, formData.academicLevel === 'undergraduate' && styles.chipSelected]}
                onPress={() => handleInputChange('academicLevel', 'undergraduate')}
              >
                <Text style={styles.chipText}>Undergraduate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, formData.academicLevel === 'graduate' && styles.chipSelected]}
                onPress={() => handleInputChange('academicLevel', 'graduate')}
              >
                <Text style={styles.chipText}>Graduate</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color={colors.background} />
              <Text style={styles.buttonText}> Generating...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>🧠 Generate Prediction</Text>
          )}
        </TouchableOpacity>
      </View>

      {prediction && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prediction Results</Text>
          <View style={styles.predictionResults}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getGpaColor(prediction.predictedGpa) }]}>
                {prediction.predictedGpa.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Predicted GPA</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{prediction.predictedCwa.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Predicted CWA</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {
                color: prediction.confidenceScore >= 0.8 ? colors.success :
                       prediction.confidenceScore >= 0.6 ? colors.warning : colors.error
              }]}>
                {(prediction.confidenceScore * 100).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Confidence</Text>
            </View>
          </View>

          {prediction.insights && prediction.insights.length > 0 && (
            <View>
              <Text style={styles.insightsTitle}>AI Insights</Text>
              {prediction.insights.map((insight, index) => (
                <View key={index} style={styles.insightCard}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                  {insight.recommendation && (
                    <Text style={styles.insightRecommendation}>💡 {insight.recommendation}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notification: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    zIndex: 1000,
    alignItems: 'center',
  },
  notificationText: {
    color: colors.background,
    fontWeight: typography.bold,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography['4xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  formContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
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
  },
  chipsContainer: {
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: typography.sm,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: 210,
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  buttonText: {
    color: colors.background,
    fontWeight: typography.semibold,
    fontSize: typography.base,
  },
  predictionResults: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  insightsTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  insightCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  insightMessage: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  insightRecommendation: {
    fontSize: typography.sm,
    color: colors.success,
    fontStyle: 'italic',
  },
});
