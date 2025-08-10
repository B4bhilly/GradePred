// Enhanced HistoryScreen with all suggested features (without VictoryNative)
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  Modal, Alert, ScrollView, Share, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useML } from '../../MLContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography, spacing, borderRadius, shadows } from '../../designSystem';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';

// Grade points mapping for GPA calculation
const gradePoints = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

export default function HistoryScreen() {
  const { studentData, addGrade, predictionHistory, exportPredictionData, deletePredictions, deleteGrades, updateGrade } = useML();
  const { colors: themeColors, isInitialized } = useTheme();
  
  // Safety check to ensure theme is ready
  if (!isInitialized || !themeColors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ color: '#1f2937' }}>Loading theme...</Text>
      </View>
    );
  }

  const [showAddGrade, setShowAddGrade] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGrades, setFilteredGrades] = useState(studentData?.grades || []);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [activeTab, setActiveTab] = useState('grades'); // 'grades' or 'predictions'
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Force reset selection mode on component mount
  useEffect(() => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  }, []);
  const [showEditGrade, setShowEditGrade] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [newGrade, setNewGrade] = useState({
    courseName: '', courseCode: '', grade: '', credits: '', semester: '',
  });

  useEffect(() => {
    // Ensure studentData.grades exists before filtering
    if (studentData?.grades) {
    setFilteredGrades(
      studentData.grades.filter(item =>
          item?.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredGrades([]);
    }
    
    // Ensure predictionHistory exists before filtering
    if (predictionHistory) {
      setFilteredPredictions(
        predictionHistory.filter(item =>
          item?.timestamp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.predicted_gpa?.toString().includes(searchQuery)
        )
      );
    } else {
      setFilteredPredictions([]);
    }
    
    // Save to AsyncStorage only if data exists
    if (studentData?.grades) {
    AsyncStorage.setItem('grades', JSON.stringify(studentData.grades));
    }
    if (predictionHistory) {
      AsyncStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
    }
  }, [searchQuery, studentData?.grades, predictionHistory]);

  // Debug logging to help identify issues
  console.log('HistoryScreen - studentData:', studentData);
  console.log('HistoryScreen - predictionHistory:', predictionHistory);
  console.log('HistoryScreen - isSelectionMode:', isSelectionMode);
  console.log('HistoryScreen - activeTab:', activeTab);

  const handleAddGrade = () => {
    if (!newGrade.courseName || !newGrade.grade || !newGrade.credits) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }

    try {
      const gradeData = {
        ...newGrade,
        credits: parseInt(newGrade.credits),
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      addGrade(gradeData);
      setShowAddGrade(false);
      setNewGrade({ courseName: '', courseCode: '', grade: '', credits: '', semester: '' });
      Alert.alert('Success', 'Grade added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add grade');
    }
  };

  const getGradeColor = (grade) => {
    const points = gradePoints[grade] || 0;
    if (points >= 3.5) return themeColors.success;
    if (points >= 3.0) return themeColors.warning;
    if (points >= 2.5) return themeColors.secondary;
    return themeColors.error;
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return themeColors.success;
    if (gpa >= 3.0) return themeColors.warning;
    if (gpa >= 2.5) return themeColors.secondary;
    return themeColors.error;
  };

  const toggleItemSelection = (id) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Delete Items',
      `Are you sure you want to delete ${selectedItems.size} selected item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const itemIds = Array.from(selectedItems);
              
              if (activeTab === 'predictions') {
                await deletePredictions(itemIds);
              } else {
                await deleteGrades(itemIds);
              }
              
              setSelectedItems(new Set());
              setIsSelectionMode(false);
              Alert.alert('Success', 'Selected items deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete selected items');
            }
          }
        }
      ]
    );
  };

  const handleExportSelected = async () => {
    try {
      let exportData = [];
      
      if (activeTab === 'predictions') {
        exportData = filteredPredictions
          .filter(item => selectedItems.has(item.id))
          .map(item => exportPredictionData(item));
      } else {
        exportData = filteredGrades.filter(item => selectedItems.has(item.id));
      }

      const csvContent = convertToCSV(exportData);
      
      // Use React Native Share API for both platforms
      await Share.share({
        message: csvContent,
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Export`,
      });
      
      setSelectedItems(new Set());
      setIsSelectionMode(false);
      Alert.alert('Success', 'Data exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const handleEditGrade = (grade) => {
    setEditingGrade({
      ...grade
    });
    setShowEditGrade(true);
  };

  const handleSaveEditedGrade = async () => {
    try {
      if (!editingGrade) return;

      // Validate required fields
      if (!editingGrade.courseName.trim() || !editingGrade.courseCode.trim() || 
          !editingGrade.grade || !editingGrade.credits || !editingGrade.semester.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Validate credits is a positive number
      const creditsNum = parseInt(editingGrade.credits);
      if (isNaN(creditsNum) || creditsNum <= 0) {
        Alert.alert('Error', 'Credits must be a positive number');
        return;
      }

      const updatedGrade = {
        ...editingGrade,
        credits: creditsNum,
        courseName: editingGrade.courseName.trim(),
        courseCode: editingGrade.courseCode.trim(),
        semester: editingGrade.semester.trim(),
      };

      await updateGrade(updatedGrade);
      setShowEditGrade(false);
      setEditingGrade(null);
      Alert.alert('Success', 'Course updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update course');
    }
  };

  const renderGradeItem = ({ item }) => {
    // Safety check
    if (!item) return null;
    
    return (
    <View 
      style={[
        styles.listItem,
        isSelectionMode && selectedItems.has(item.id) && styles.selectedItem
      ]}
    >
      <TouchableOpacity 
        style={styles.listItemContent}
        onPress={() => isSelectionMode && toggleItemSelection(item.id)}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleItemSelection(item.id);
        }}
      >
      <View style={styles.listItemHeader}>
          <View style={{ flex: 1 }}>
          <Text style={[styles.listItemTitle, { color: themeColors.textPrimary }]}>{item.courseName}</Text>
          {item.courseCode ? <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>{item.courseCode}</Text> : null}
          {item.semester ? <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>{item.semester}</Text> : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
            <Text style={styles.gradeText}>{item.grade}</Text>
          </View>
          <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>{item.credits} Credits</Text>
          <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
              {((gradePoints[item.grade] || 0) * (item.credits || 0)).toFixed(1)} pts
          </Text>
          </View>
          {isSelectionMode && (
            <View style={styles.selectionIndicator}>
              <Ionicons 
                name={selectedItems.has(item.id) ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={selectedItems.has(item.id) ? themeColors.primary : themeColors.textSecondary} 
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Always show edit button - override selection mode for individual items */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity 
          style={styles.editActionButton}
          onPress={() => {
            // Exit selection mode and edit the grade
            setIsSelectionMode(false);
            setSelectedItems(new Set());
            handleEditGrade(item);
          }}
        >
          <Ionicons name="create-outline" size={16} color={themeColors.primary} />
          <Text style={[styles.editActionButtonText, { color: themeColors.primary }]}>✏️ Edit Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  };

  const renderPredictionItem = ({ item }) => {
    // Safety check
    if (!item) return null;
    
    return (
    <TouchableOpacity 
      style={[
        styles.listItem,
        isSelectionMode && selectedItems.has(item.id) && styles.selectedItem
      ]}
      onPress={() => isSelectionMode && toggleItemSelection(item.id)}
      onLongPress={() => {
        setIsSelectionMode(true);
        toggleItemSelection(item.id);
      }}
    >
      <View style={styles.listItemHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.listItemTitle, { color: themeColors.textPrimary }]}>GPA Prediction</Text>
          <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>Confidence: {item.confidence}%</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[styles.gradeBadge, { backgroundColor: getGpaColor(item.predicted_gpa) }]}>
            <Text style={styles.gradeText}>{item.predicted_gpa?.toFixed(2)}</Text>
          </View>
          <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>Predicted GPA</Text>
        </View>
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <Ionicons 
              name={selectedItems.has(item.id) ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={selectedItems.has(item.id) ? themeColors.primary : themeColors.textSecondary} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
    );
  };

  // Define styles inside the component for proper theme access
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      backgroundColor: themeColors.background,
      paddingHorizontal: spacing.medium,
      paddingTop: spacing.large,
      paddingBottom: spacing.medium,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.small,
    },
    title: {
      ...typography.h1,
      color: themeColors.textPrimary,
      flex: 1,
    },
    subtitle: {
      ...typography.body2,
      color: themeColors.textSecondary,
      marginBottom: spacing.medium,
    },
    clearSelectionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.small,
      paddingVertical: spacing.xsmall,
      borderRadius: borderRadius.small,
      backgroundColor: themeColors.card,
    },
    clearSelectionText: {
      ...typography.body2,
      color: themeColors.primary,
      marginLeft: spacing.xsmall,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: themeColors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.xsmall,
      marginBottom: spacing.medium,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.small,
      borderRadius: borderRadius.small,
    },
    activeTab: {
      backgroundColor: themeColors.primary,
    },
    tabText: {
      ...typography.body2,
      color: themeColors.textSecondary,
      marginLeft: spacing.xsmall,
    },
    activeTabText: {
      color: themeColors.background,
    },
    searchInput: {
      ...typography.body1,
      backgroundColor: themeColors.inputBackground,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      color: themeColors.textPrimary,
    },
    selectionActions: {
      flexDirection: 'row',
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      gap: spacing.small,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.small,
      borderRadius: borderRadius.medium,
      gap: spacing.xsmall,
    },
    deleteButton: {
      backgroundColor: themeColors.error,
    },
    exportButton: {
      backgroundColor: themeColors.success,
    },
    actionButtonText: {
      ...typography.body2,
      color: themeColors.background,
      fontWeight: '600',
    },
    card: {
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: borderRadius.medium,
      marginHorizontal: spacing.medium,
      marginBottom: spacing.medium,
      padding: spacing.medium,
      ...shadows.small,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.medium,
    },
    cardTitle: {
      ...typography.h2,
      color: themeColors.textPrimary,
    },
    addButton: {
      backgroundColor: themeColors.primary,
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      borderRadius: borderRadius.small,
    },
    addButtonText: {
      ...typography.body2,
      color: themeColors.background,
      fontWeight: '600',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: spacing.small,
    },
    statItem: {
      alignItems: 'center',
      minWidth: 80,
    },
    statValue: {
      ...typography.h2,
      color: themeColors.textPrimary,
      fontWeight: '700',
    },
    statLabel: {
      ...typography.caption,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
    listItem: {
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: borderRadius.medium,
      marginBottom: spacing.small,
      overflow: 'hidden',
    },
    selectedItem: {
      borderColor: themeColors.primary,
      borderWidth: 2,
    },
    listItemContent: {
      padding: spacing.medium,
    },
    listItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    listItemTitle: {
      ...typography.h3,
      color: themeColors.textPrimary,
      marginBottom: spacing.xsmall,
    },
    listItemMeta: {
      ...typography.body2,
      color: themeColors.textSecondary,
      marginBottom: spacing.xsmall,
    },
    gradeBadge: {
      paddingHorizontal: spacing.small,
      paddingVertical: spacing.xsmall,
      borderRadius: borderRadius.small,
      minWidth: 40,
      alignItems: 'center',
      marginBottom: spacing.xsmall,
    },
    gradeText: {
      ...typography.body2,
      color: themeColors.background,
      fontWeight: '700',
    },
    selectionIndicator: {
      position: 'absolute',
      top: spacing.small,
      right: spacing.small,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      paddingTop: spacing.small,
    },
    editActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xsmall,
      gap: spacing.xsmall,
    },
    editActionButtonText: {
      ...typography.body2,
      color: themeColors.primary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xlarge,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: spacing.medium,
    },
    emptyTitle: {
      ...typography.h3,
      color: themeColors.textPrimary,
      marginBottom: spacing.small,
      textAlign: 'center',
    },
    emptyText: {
      ...typography.body2,
      color: themeColors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.medium,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: themeColors.card,
      borderRadius: borderRadius.medium,
      padding: spacing.large,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      ...typography.h2,
      color: themeColors.textPrimary,
      marginBottom: spacing.medium,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: spacing.medium,
    },
    inputLabel: {
      ...typography.body2,
      color: themeColors.textPrimary,
      marginBottom: spacing.xsmall,
      fontWeight: '600',
    },
    inputField: {
      ...typography.body1,
      backgroundColor: themeColors.inputBackground,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.small,
      color: themeColors.textPrimary,
    },
    pickerContainer: {
      backgroundColor: themeColors.inputBackground,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: borderRadius.medium,
      overflow: 'hidden',
    },
    picker: {
      color: themeColors.textPrimary,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.large,
      gap: spacing.medium,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.medium,
      borderRadius: borderRadius.medium,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: themeColors.secondary,
    },
    saveButton: {
      backgroundColor: themeColors.primary,
    },
    buttonText: {
      ...typography.body2,
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <View style={styles.headerTop}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Academic History</Text>
          <TouchableOpacity 
            style={styles.clearSelectionButton}
            onPress={() => {
              setIsSelectionMode(false);
              setSelectedItems(new Set());
            }}
          >
            <Ionicons name="refresh" size={20} color={themeColors.primary} />
            <Text style={[styles.clearSelectionText, { color: themeColors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          {isSelectionMode 
            ? `${selectedItems.size} item(s) selected` 
            : 'Track your course grades and prediction history'
          }
        </Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'grades' && styles.activeTab]}
            onPress={() => setActiveTab('grades')}
          >
            <Ionicons name="school" size={20} color={activeTab === 'grades' ? themeColors.primary : themeColors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'grades' && styles.activeTabText]}>
              Grades
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
            onPress={() => setActiveTab('predictions')}
          >
            <Ionicons name="analytics" size={20} color={activeTab === 'predictions' ? themeColors.primary : themeColors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
              Predictions
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: themeColors.inputBackground, 
            borderColor: themeColors.border,
            color: themeColors.textPrimary 
          }]}
          placeholder={activeTab === 'grades' ? "Search by course name..." : "Search predictions..."}
          placeholderTextColor={themeColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Selection Actions */}
      {isSelectionMode && selectedItems.size > 0 && (
        <View style={styles.selectionActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDeleteSelected}
          >
            <Ionicons name="trash-outline" size={20} color={themeColors.background} />
            <Text style={styles.actionButtonText}>Delete ({selectedItems.size})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.exportButton]} 
            onPress={handleExportSelected}
          >
            <Ionicons name="download-outline" size={20} color={themeColors.background} />
            <Text style={styles.actionButtonText}>Export ({selectedItems.size})</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>Academic Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>{studentData.currentGpa.toFixed(2)}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Current GPA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>{studentData.currentCwa.toFixed(1)}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Current CWA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>{studentData.totalCredits}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Total Credits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>{studentData.grades.length}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Courses</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>
            {activeTab === 'grades' ? 'Course Grades' : 'Prediction History'}
          </Text>
          {activeTab === 'grades' && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddGrade(true)}>
            <Text style={styles.addButtonText}>+ Add Grade</Text>
          </TouchableOpacity>
          )}
        </View>

        {activeTab === 'grades' ? (
          filteredGrades.length > 0 ? (
          <FlatList
            data={filteredGrades}
              keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            renderItem={renderGradeItem}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>No grades recorded yet</Text>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              Add your first course grade to start tracking your academic progress
            </Text>
          </View>
          )
        ) : (
          filteredPredictions.length > 0 ? (
            <FlatList
              data={filteredPredictions}
              keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
              renderItem={renderPredictionItem}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔮</Text>
              <Text style={styles.emptyTitle}>No predictions yet</Text>
              <Text style={styles.emptyText}>
                Generate your first GPA prediction to see your academic forecast
              </Text>
            </View>
          )
        )}
      </View>

      {/* Add Grade Modal */}
      <Modal visible={showAddGrade} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Grade</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Name *</Text>
              <TextInput
                style={styles.inputField}
                value={newGrade.courseName}
                onChangeText={(text) => setNewGrade(prev => ({ ...prev, courseName: text }))}
                placeholder="Enter course name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Code</Text>
              <TextInput
                style={styles.inputField}
                value={newGrade.courseCode}
                onChangeText={(text) => setNewGrade(prev => ({ ...prev, courseCode: text }))}
                placeholder="Enter course code (optional)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Grade *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newGrade.grade}
                  onValueChange={(value) => setNewGrade(prev => ({ ...prev, grade: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Grade" value="" />
                  <Picker.Item label="A+" value="A+" />
                  <Picker.Item label="A" value="A" />
                  <Picker.Item label="A-" value="A-" />
                  <Picker.Item label="B+" value="B+" />
                  <Picker.Item label="B" value="B" />
                  <Picker.Item label="B-" value="B-" />
                  <Picker.Item label="C+" value="C+" />
                  <Picker.Item label="C" value="C" />
                  <Picker.Item label="C-" value="C-" />
                  <Picker.Item label="D+" value="D+" />
                  <Picker.Item label="D" value="D" />
                  <Picker.Item label="D-" value="D-" />
                  <Picker.Item label="F" value="F" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Credits *</Text>
              <TextInput
                style={styles.inputField}
                value={newGrade.credits}
                onChangeText={(text) => setNewGrade(prev => ({ ...prev, credits: text }))}
                placeholder="Enter credits"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Semester</Text>
              <TextInput
                style={styles.inputField}
                value={newGrade.semester}
                onChangeText={(text) => setNewGrade(prev => ({ ...prev, semester: text }))}
                placeholder="Enter semester (optional)"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddGrade(false)}
              >
                <Text style={[styles.buttonText, { color: themeColors.background }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddGrade}
              >
                <Text style={[styles.buttonText, { color: themeColors.background }]}>Add Grade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Grade Modal */}
      <Modal visible={showEditGrade} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Grade</Text>
            
            {editingGrade && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Course Name *</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editingGrade.courseName}
                    onChangeText={(text) => setEditingGrade(prev => ({ ...prev, courseName: text }))}
                    placeholder="Enter course name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Course Code *</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editingGrade.courseCode}
                    onChangeText={(text) => setEditingGrade(prev => ({ ...prev, courseCode: text }))}
                    placeholder="Enter course code"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Grade *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={editingGrade.grade}
                      onValueChange={(value) => setEditingGrade(prev => ({ ...prev, grade: value }))}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Grade" value="" />
                      <Picker.Item label="A+" value="A+" />
                      <Picker.Item label="A" value="A" />
                      <Picker.Item label="A-" value="A-" />
                      <Picker.Item label="B+" value="B+" />
                      <Picker.Item label="B" value="B" />
                      <Picker.Item label="B-" value="B-" />
                      <Picker.Item label="C+" value="C+" />
                      <Picker.Item label="C" value="C" />
                      <Picker.Item label="C-" value="C-" />
                      <Picker.Item label="D+" value="D+" />
                      <Picker.Item label="D" value="D" />
                      <Picker.Item label="D-" value="D-" />
                      <Picker.Item label="F" value="F" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Credits *</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editingGrade.credits}
                    onChangeText={(text) => setEditingGrade(prev => ({ ...prev, credits: text }))}
                    placeholder="Enter credits"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Semester *</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editingGrade.semester}
                    onChangeText={(text) => setEditingGrade(prev => ({ ...prev, semester: text }))}
                    placeholder="Enter semester"
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEditGrade(false)}
                  >
                    <Text style={[styles.buttonText, { color: themeColors.background }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveEditedGrade}
                  >
                    <Text style={[styles.buttonText, { color: themeColors.background }]}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
