import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  Modal, Alert, ScrollView, Share, Platform, RefreshControl, SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useML } from '../../MLContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography, spacing, borderRadius, shadows } from '../../designSystem';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
        <Text style={{ color: '#1f2937', fontSize: 18 }}>Loading theme...</Text>
        <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 10 }}>Please wait while we initialize the app</Text>
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
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      // Ensure studentData.grades exists before filtering
      if (studentData?.grades && Array.isArray(studentData.grades)) {
        const filtered = studentData.grades.filter(item =>
          item?.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredGrades(filtered);
      } else {
        setFilteredGrades([]);
      }
      
      // Ensure predictionHistory exists before filtering
      if (predictionHistory && Array.isArray(predictionHistory)) {
        const filtered = predictionHistory.filter(item =>
          item?.timestamp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.predicted_gpa?.toString().includes(searchQuery)
        );
        setFilteredPredictions(filtered);
      } else {
        setFilteredPredictions([]);
      }
      
      // Save to AsyncStorage only if data exists and is valid
      if (studentData?.grades && Array.isArray(studentData.grades)) {
        AsyncStorage.setItem('grades', JSON.stringify(studentData.grades)).catch(error => {
          console.error('Error saving grades to storage:', error);
        });
      }
      if (predictionHistory && Array.isArray(predictionHistory)) {
        AsyncStorage.setItem('predictionHistory', JSON.stringify(predictionHistory)).catch(error => {
          console.error('Error saving predictions to storage:', error);
        });
      }
    } catch (error) {
      console.error('Error in search/filter effect:', error);
      // Fallback to empty arrays on error
      setFilteredGrades([]);
      setFilteredPredictions([]);
    }
  }, [searchQuery, studentData?.grades, predictionHistory]);

  // Debug logging to help identify issues
  if (__DEV__) {
    console.log('HistoryScreen - studentData:', studentData);
    console.log('HistoryScreen - predictionHistory:', predictionHistory);
    console.log('HistoryScreen - isSelectionMode:', isSelectionMode);
    console.log('HistoryScreen - activeTab:', activeTab);
    console.log('HistoryScreen - themeColors:', themeColors);
    console.log('HistoryScreen - isInitialized:', isInitialized);
  }

  const handleAddGrade = async () => {
    // Enhanced validation
    if (!newGrade.courseName?.trim()) {
      Alert.alert('Validation Error', 'Course name is required');
      return;
    }
    
    if (!newGrade.grade) {
      Alert.alert('Validation Error', 'Please select a grade');
      return;
    }
    
    if (!newGrade.credits || isNaN(parseInt(newGrade.credits)) || parseInt(newGrade.credits) <= 0) {
      Alert.alert('Validation Error', 'Credits must be a positive number');
      return;
    }

    try {
      const gradeData = {
        ...newGrade,
        courseName: newGrade.courseName.trim(),
        courseCode: newGrade.courseCode?.trim() || '',
        semester: newGrade.semester?.trim() || '',
        credits: parseInt(newGrade.credits),
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      await addGrade(gradeData);
      setShowAddGrade(false);
      setNewGrade({ courseName: '', courseCode: '', grade: '', credits: '', semester: '' });
      Alert.alert('Success', 'Grade added successfully!');
    } catch (error) {
      console.error('Error adding grade:', error);
      Alert.alert('Error', error.message || 'Failed to add grade. Please try again.');
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
      `Are you sure you want to delete ${selectedItems.size} selected item(s)? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
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
              console.error('Error deleting items:', error);
              Alert.alert('Error', error.message || 'Failed to delete selected items. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleExportSelected = async () => {
    try {
      setIsLoading(true);
      let exportData = [];
      
      if (activeTab === 'predictions') {
        exportData = filteredPredictions
          .filter(item => selectedItems.has(item.id))
          .map(item => exportPredictionData(item));
      } else {
        exportData = filteredGrades.filter(item => selectedItems.has(item.id));
      }

      if (exportData.length === 0) {
        Alert.alert('No Data', 'No data selected for export');
        return;
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
      console.error('Error exporting data:', error);
      Alert.alert('Error', error.message || 'Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const convertToCSV = (data) => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data to export');
      }
      
      // Filter out undefined/null values and ensure all items have the same structure
      const cleanData = data.filter(item => item && typeof item === 'object');
      
      if (cleanData.length === 0) {
        throw new Error('No valid data to export');
      }
      
      const headers = Object.keys(cleanData[0]).filter(key => key !== 'id'); // Exclude internal ID
      const rows = cleanData.map(item => 
        headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`; // Escape quotes
          return value;
        }).join(',')
      );
      
      return [headers.join(','), ...rows].join('\n');
    } catch (error) {
      console.error('Error converting to CSV:', error);
      throw new Error('Failed to convert data to CSV format');
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade({
      ...grade
    });
    setShowEditGrade(true);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Refresh data from context
      if (studentData?.grades) {
        setFilteredGrades(studentData.grades);
      }
      if (predictionHistory) {
        setFilteredPredictions(predictionHistory);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const gradeKeyExtractor = useCallback((item, index) => {
    if (item?.id) return item.id.toString();
    if (item?.courseName) return `${item.courseName}_${index}`;
    return index.toString();
  }, []);

  const predictionKeyExtractor = useCallback((item, index) => {
    if (item?.id) return item.id.toString();
    if (item?.timestamp) return `${item.timestamp}_${index}`;
    return index.toString();
  }, []);

  const handleSaveEditedGrade = async () => {
    try {
      if (!editingGrade) {
        Alert.alert('Error', 'No grade data to edit');
        return;
      }

      // Enhanced validation
      if (!editingGrade.courseName?.trim()) {
        Alert.alert('Validation Error', 'Course name is required');
        return;
      }

      if (!editingGrade.courseCode?.trim()) {
        Alert.alert('Validation Error', 'Course code is required');
        return;
      }

      if (!editingGrade.grade) {
        Alert.alert('Validation Error', 'Please select a grade');
        return;
      }

      if (!editingGrade.credits || isNaN(parseInt(editingGrade.credits)) || parseInt(editingGrade.credits) <= 0) {
        Alert.alert('Validation Error', 'Credits must be a positive number');
        return;
      }

      if (!editingGrade.semester?.trim()) {
        Alert.alert('Validation Error', 'Semester is required');
        return;
      }

      setIsLoading(true);

      const updatedGrade = {
        ...editingGrade,
        credits: parseInt(editingGrade.credits),
        courseName: editingGrade.courseName.trim(),
        courseCode: editingGrade.courseCode.trim(),
        semester: editingGrade.semester.trim(),
      };

      await updateGrade(updatedGrade);
      setShowEditGrade(false);
      setEditingGrade(null);
      Alert.alert('Success', 'Course updated successfully!');
    } catch (error) {
      console.error('Error updating grade:', error);
      Alert.alert('Error', error.message || 'Failed to update course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGradeItem = useCallback(({ item }) => {
    // Enhanced safety check
    if (!item || !item.id || !item.courseName) {
      console.warn('Invalid grade item:', item);
      return null;
    }
    
    try {
      const gradePointsEarned = ((gradePoints[item.grade] || 0) * (item.credits || 0)).toFixed(1);
      
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
                <Text style={[styles.listItemTitle, { color: themeColors.textPrimary }]}>
                  {item.courseName || 'Unnamed Course'}
                </Text>
                {item.courseCode ? (
                  <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                    {item.courseCode}
                  </Text>
                ) : null}
                {item.semester ? (
                  <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                    {item.semester}
                  </Text>
                ) : null}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
                  <Text style={styles.gradeText}>{item.grade || 'N/A'}</Text>
                </View>
                <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                  {item.credits || 0} Credits
                </Text>
                <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                  {gradePointsEarned} pts
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
    } catch (error) {
      console.error('Error rendering grade item:', error, item);
      return null;
    }
  }, [isSelectionMode, selectedItems, themeColors]);

  const renderPredictionItem = useCallback(({ item }) => {
    // Enhanced safety check
    if (!item || !item.id || !item.timestamp) {
      console.warn('Invalid prediction item:', item);
      return null;
    }
    
    try {
      const timestamp = new Date(item.timestamp);
      const isInvalidDate = isNaN(timestamp.getTime());
      
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
              <Text style={[styles.listItemTitle, { color: themeColors.textPrimary }]}>
                GPA Prediction
              </Text>
              <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                {isInvalidDate ? 'Invalid Date' : timestamp.toLocaleDateString()} 
                {!isInvalidDate && ` at ${timestamp.toLocaleTimeString()}`}
              </Text>
              <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                Confidence: {item.confidence || 'N/A'}%
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={[styles.gradeBadge, { backgroundColor: getGpaColor(item.predicted_gpa) }]}>
                <Text style={styles.gradeText}>
                  {item.predicted_gpa ? item.predicted_gpa.toFixed(2) : 'N/A'}
                </Text>
              </View>
              <Text style={[styles.listItemMeta, { color: themeColors.textSecondary }]}>
                Predicted GPA
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
      );
    } catch (error) {
      console.error('Error rendering prediction item:', error, item);
      return null;
    }
  }, [isSelectionMode, selectedItems, themeColors]);

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
    clearSelectionButtonText: {
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
    searchContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
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
      flex: 1,
    },
    clearSearchButton: {
      position: 'absolute',
      right: spacing.small,
      padding: spacing.xsmall,
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
    disabledButton: {
      opacity: 0.6,
    },
    buttonText: {
      ...typography.body2,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
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

        <View style={styles.searchContainer}>
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
            maxLength={100}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Selection Actions */}
      {isSelectionMode && selectedItems.size > 0 && (
        <View style={styles.selectionActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDeleteSelected}
            disabled={isLoading}
          >
            <Ionicons 
              name={isLoading ? "hourglass-outline" : "trash-outline"} 
              size={20} 
              color={themeColors.background} 
            />
            <Text style={styles.actionButtonText}>
              {isLoading ? 'Deleting...' : `Delete (${selectedItems.size})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.exportButton]} 
            onPress={handleExportSelected}
            disabled={isLoading}
          >
            <Ionicons 
              name={isLoading ? "hourglass-outline" : "download-outline"} 
              size={20} 
              color={themeColors.background} 
            />
            <Text style={styles.actionButtonText}>
              {isLoading ? 'Exporting...' : `Export (${selectedItems.size})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>Academic Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
              {studentData?.currentGpa ? studentData.currentGpa.toFixed(2) : '0.00'}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Current GPA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
              {studentData?.currentCwa ? studentData.currentCwa.toFixed(1) : '0.0'}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Current CWA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
              {studentData?.totalCredits || 0}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Total Credits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
              {studentData?.grades?.length || 0}
            </Text>
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
            <TouchableOpacity 
              style={[styles.addButton, isLoading && styles.disabledButton]} 
              onPress={() => setShowAddGrade(true)}
              disabled={isLoading}
            >
              <Text style={styles.addButtonText}>+ Add Grade</Text>
            </TouchableOpacity>
          )}
        </View>

        {activeTab === 'grades' ? (
          filteredGrades.length > 0 ? (
          <FlatList
            data={filteredGrades}
            keyExtractor={gradeKeyExtractor}
            renderItem={renderGradeItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.medium }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[themeColors.primary]}
                tintColor={themeColors.primary}
              />
            }
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
              keyExtractor={predictionKeyExtractor}
              renderItem={renderPredictionItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing.medium }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[themeColors.primary]}
                  tintColor={themeColors.primary}
                />
              }
            />
          ) : (
                      <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔮</Text>
            <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>No predictions yet</Text>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
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
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, { color: themeColors.background }]}>
                  {isLoading ? 'Adding...' : 'Add Grade'}
                </Text>
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
                  disabled={isLoading}
                >
                  <Text style={[styles.buttonText, { color: themeColors.background }]}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
