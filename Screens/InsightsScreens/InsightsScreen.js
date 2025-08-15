import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useML } from '../../MLContext';
import { typography, spacing, borderRadius, shadows } from '../../designSystem';
import { useTheme } from '../../ThemeContext';

export default function InsightsScreen() {
  const { studentData, predictions, predictionHistory } = useML();
  const { colors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateInsights();
  }, [studentData, predictions, predictionHistory]);

  const generateInsights = () => {
    const generatedInsights = [];

    if (studentData.currentGpa > 0) {
      const gpaLevel = getGPALevel(studentData.currentGpa);
      generatedInsights.push({
        id: 'gpa-performance',
        type: 'performance',
        title: 'GPA Performance Analysis',
        priority: studentData.currentGpa < 3.0 ? 'high' : 'medium',
        icon: '📈',
        description: `Your current GPA of ${studentData.currentGpa.toFixed(2)} is classified as ${gpaLevel}.`,
        recommendations: getGPARecommendations(studentData.currentGpa),
        actionItems: getGPAActionItems(studentData.currentGpa),
      });
    }

    if (studentData.totalCredits > 0) {
      const progressPercentage = (studentData.totalCredits / 120) * 100;
      generatedInsights.push({
        id: 'credit-progress',
        type: 'progress',
        title: 'Degree Progress Tracking',
        priority: 'low',
        icon: '🎓',
        description: `You have completed ${studentData.totalCredits} credits (${progressPercentage.toFixed(1)}% of typical degree).`,
        recommendations: getCreditRecommendations(studentData.totalCredits),
        actionItems: ['Review graduation requirements', 'Plan next semester courses'],
      });
    }

    if (studentData.grades.length > 0) {
      const gradeDistribution = getGradeDistribution(studentData.grades);
      generatedInsights.push({
        id: 'grade-distribution',
        type: 'analysis',
        title: 'Grade Distribution Analysis',
        priority: 'medium',
        icon: '📊',
        description: 'Analysis of your grade patterns and subject performance.',
        recommendations: getGradeDistributionRecommendations(gradeDistribution),
        actionItems: ['Focus on weak subject areas', 'Maintain strong performance'],
        data: gradeDistribution,
      });
    }

    generatedInsights.push({
      id: 'study-patterns',
      type: 'behavioral',
      title: 'Study Pattern Optimization',
      priority: 'medium',
      icon: '⏰',
      description: 'Recommendations for improving your study habits and time management.',
      recommendations: [
        'Maintain consistent study schedule',
        'Use active learning techniques',
        'Take regular breaks during study sessions',
        'Review material within 24 hours of learning',
      ],
      actionItems: [
        'Create a weekly study timetable',
        'Set up distraction-free study environment',
        'Use the Pomodoro technique for focused study',
      ],
    });

    if (predictionHistory.length > 0) {
      const latestPrediction = predictionHistory[0];
      const confidence = latestPrediction.confidence || 75;
      const predictedGpa = latestPrediction.predicted_gpa || 0;
      
      generatedInsights.push({
        id: 'prediction-analysis',
        type: 'prediction',
        title: 'AI Prediction Insights',
        priority: confidence > 80 ? 'high' : 'medium',
        icon: '🧠',
        description: `Based on AI analysis, your predicted GPA is ${predictedGpa.toFixed(2)} with ${confidence}% confidence.`,
        recommendations: getPredictionRecommendations(latestPrediction),
        actionItems: ['Follow AI recommendations', 'Monitor progress regularly'],
      });

      // Add prediction trend analysis if we have multiple predictions
      if (predictionHistory.length > 1) {
        const trend = analyzePredictionTrend(predictionHistory);
        generatedInsights.push({
          id: 'prediction-trend',
          type: 'trend',
          title: 'Performance Trend Analysis',
          priority: trend.direction === 'declining' ? 'high' : 'low',
          icon: trend.direction === 'improving' ? '📈' : trend.direction === 'declining' ? '📉' : '➡️',
          description: `Your recent predictions show a ${trend.direction} trend over ${predictionHistory.length} predictions.`,
          recommendations: trend.recommendations,
          actionItems: trend.actionItems,
        });
      }
    }

    // Add welcome insight if no data
    if (studentData.currentGpa === 0 && studentData.grades.length === 0 && predictionHistory.length === 0) {
      generatedInsights.push({
        id: 'welcome',
        type: 'welcome',
        title: 'Welcome to Academic Insights',
        priority: 'medium',
        icon: '👋',
        description: 'Start using the GPA and CWA predictors to generate personalized academic insights.',
        recommendations: [
          'Add your current GPA and course information',
          'Generate your first prediction',
          'Track your academic progress over time',
        ],
        actionItems: [
          'Go to GPA Predictor and enter your data',
          'Add your course grades in the History section',
          'Check back regularly for updated insights',
        ],
      });
    }

    setInsights(generatedInsights);
  };

  const getGPALevel = (gpa) => {
    if (gpa >= 3.8) return 'Excellent';
    if (gpa >= 3.5) return 'Very Good';
    if (gpa >= 3.0) return 'Good';
    if (gpa >= 2.5) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const getGPARecommendations = (gpa) => {
    if (gpa >= 3.8) return ['Maintain excellent performance', 'Explore research opportunities'];
    if (gpa >= 3.5) return ['Continue strong performance', 'Consider graduate prep'];
    if (gpa >= 3.0) return ['Focus on consistent improvement', 'Improve study techniques'];
    return ['Seek academic advising', 'Consider tutoring services'];
  };

  const getGPAActionItems = (gpa) => {
    if (gpa < 3.0) return ['Schedule advisor meeting', 'Join study groups'];
    return ['Set higher GPA targets', 'Explore research'];
  };

  const getCreditRecommendations = (credits) => {
    if (credits < 30) return ['Focus on core requirements'];
    if (credits < 60) return ['Begin major-specific courses'];
    if (credits < 90) return ['Complete major requirements'];
    return ['Prepare for graduation'];
  };

  const getGradeDistribution = (grades) => {
    const distribution = {};
    grades.forEach(g => {
      distribution[g.grade] = (distribution[g.grade] || 0) + 1;
    });
    return distribution;
  };

  const getGradeDistributionRecommendations = (dist) => {
    const recommendations = [];
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    const aGrades = (dist['A+'] || 0) + (dist['A'] || 0);
    const lowGrades = (dist['C'] || 0) + (dist['D'] || 0) + (dist['F'] || 0);

    if (aGrades / total > 0.6) recommendations.push('Excellent performance');
    if (lowGrades > 0) recommendations.push('Focus on weak subjects');
    return recommendations;
  };

  const getPredictionRecommendations = (p) => {
    const rec = [];
    const predictedGpa = p.predicted_gpa || 0;
    const confidence = p.confidence || 75;
    
    if (predictedGpa > studentData.currentGpa) {
      rec.push('Maintain current strategies');
      rec.push('Your trajectory looks positive');
    } else {
      rec.push('Adjust study approach');
      rec.push('Consider increasing study time');
    }
    
    if (confidence < 70) {
      rec.push('Add consistent study patterns');
      rec.push('Provide more academic data for better predictions');
    }
    
    return rec;
  };

  const analyzePredictionTrend = (predictions) => {
    if (predictions.length < 2) return { direction: 'stable', recommendations: [], actionItems: [] };

    const recent = predictions.slice(0, Math.min(3, predictions.length));
    const recentAvg = recent.reduce((sum, p) => sum + (p.predicted_gpa || 0), 0) / recent.length;
    
    const older = predictions.slice(3, Math.min(6, predictions.length));
    const olderAvg = older.length > 0 ? older.reduce((sum, p) => sum + (p.predicted_gpa || 0), 0) / older.length : recentAvg;

    let direction = 'stable';
    let recommendations = [];
    let actionItems = [];

    if (recentAvg > olderAvg + 0.1) {
      direction = 'improving';
      recommendations = ['Keep up the excellent work', 'Continue current study methods'];
      actionItems = ['Maintain study schedule', 'Consider advanced courses'];
    } else if (recentAvg < olderAvg - 0.1) {
      direction = 'declining';
      recommendations = ['Review and adjust study strategies', 'Seek academic support if needed'];
      actionItems = ['Schedule advisor meeting', 'Increase study time', 'Join study groups'];
    } else {
      direction = 'stable';
      recommendations = ['Consistent performance', 'Consider ways to improve further'];
      actionItems = ['Set new academic goals', 'Explore additional learning resources'];
    }

    return { direction, recommendations, actionItems };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  // Create styles object inside component to access colors
  const styles = StyleSheet.create({
    screen: {
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      backgroundColor: colors.primary,
      padding: spacing.xl,
    },
    title: {
      fontSize: typography['3xl'],
      color: colors.background,
      fontWeight: typography.bold,
    },
    subtitle: {
      fontSize: typography.base,
      color: colors.background,
      opacity: 0.9,
      marginTop: spacing.xs,
    },
    card: {
      backgroundColor: colors.background,
      margin: spacing.lg,
      padding: spacing.xl,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    icon: {
      fontSize: typography['2xl'],
      marginRight: spacing.sm,
    },
    cardTitle: {
      fontSize: typography.lg,
      fontWeight: typography.semibold,
      color: colors.textPrimary,
      flex: 1,
    },
    priority: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.full,
      fontSize: typography.xs,
      fontWeight: typography.medium,
      color: colors.background,
    },
    description: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    section: {
      marginTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.base,
      fontWeight: typography.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    bullet: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <ScrollView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Academic Insights</Text>
          <Text style={styles.subtitle}>Personalized recommendations to improve your academic performance</Text>
        </View>

        {insights.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.priority, { backgroundColor: getPriorityColor(item.priority) }]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            {item.recommendations?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {item.recommendations.map((rec, i) => (
                  <Text key={i} style={styles.bullet}>💡 {rec}</Text>
                ))}
              </View>
            )}

            {item.actionItems?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Action Items</Text>
                {item.actionItems.map((a, i) => (
                  <Text key={i} style={styles.bullet}>✅ {a}</Text>
                ))}
              </View>
            )}

            {item.data && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Grade Distribution</Text>
                {Object.entries(item.data).map(([grade, count]) => (
                  <Text key={grade} style={styles.bullet}>{grade}: {count}</Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
