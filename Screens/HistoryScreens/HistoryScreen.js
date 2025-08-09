// Enhanced HistoryScreen with all suggested features (without VictoryNative)
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  Modal, Alert, ScrollView, Share, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useML } from '../../MLContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../designSystem';
import { Ionicons } from '@expo/vector-icons';

const gradePoints = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

export default function HistoryScreen() {
  const { studentData, addGrade, predictionHistory, exportPredictionData, deletePredictions, deleteGrades, updateGrade } = useML();
  
  // Debug logging to help identify issues
  console.log('HistoryScreen - studentData:', studentData);
  console.log('HistoryScreen - predictionHistory:', predictionHistory);
  console.log('HistoryScreen - isSelectionMode:', isSelectionMode);
  console.log('HistoryScreen - activeTab:', activeTab);
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
    if (points >= 3.5) return colors.success;
    if (points >= 3.0) return colors.warning;
    if (points >= 2.5) return colors.secondary;
    return colors.error;
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return colors.success;
    if (gpa >= 3.0) return colors.warning;
    if (gpa >= 2.5) return colors.secondary;
    return colors.error;
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
      
      if (Platform.OS === 'web') {
        downloadCSV(csvContent, `${activeTab}_export_${Date.now()}.csv`);
      } else {
        await Share.share({
          message: csvContent,
          title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Export`,
        });
      }
      
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

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
          <Text style={styles.listItemTitle}>{item.courseName}</Text>
          {item.courseCode ? <Text style={styles.listItemMeta}>{item.courseCode}</Text> : null}
          {item.semester ? <Text style={styles.listItemMeta}>{item.semester}</Text> : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
            <Text style={styles.gradeText}>{item.grade}</Text>
          </View>
          <Text style={styles.listItemMeta}>{item.credits} Credits</Text>
          <Text style={styles.listItemMeta}>
              {((gradePoints[item.grade] || 0) * (item.credits || 0)).toFixed(1)} pts
          </Text>
          </View>
          {isSelectionMode && (
            <View style={styles.selectionIndicator}>
              <Ionicons 
                name={selectedItems.has(item.id) ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={selectedItems.has(item.id) ? colors.primary : colors.textSecondary} 
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
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.editActionButtonText}>✏️ Edit Course</Text>
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
          <Text style={styles.listItemTitle}>GPA Prediction</Text>
          <Text style={styles.listItemMeta}>
            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          <Text style={styles.listItemMeta}>Confidence: {item.confidence}%</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[styles.gradeBadge, { backgroundColor: getGpaColor(item.predicted_gpa) }]}>
            <Text style={styles.gradeText}>{item.predicted_gpa?.toFixed(2)}</Text>
          </View>
          <Text style={styles.listItemMeta}>Predicted GPA</Text>
        </View>
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <Ionicons 
              name={selectedItems.has(item.id) ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={selectedItems.has(item.id) ? colors.primary : colors.textSecondary} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
        <Text style={styles.title}>Academic History</Text>
          <TouchableOpacity 
            style={styles.clearSelectionButton}
            onPress={() => {
              setIsSelectionMode(false);
              setSelectedItems(new Set());
            }}
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.clearSelectionText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
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
            <Ionicons name="school" size={20} color={activeTab === 'grades' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'grades' && styles.activeTabText]}>
              Grades
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
            onPress={() => setActiveTab('predictions')}
          >
            <Ionicons name="analytics" size={20} color={activeTab === 'predictions' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
              Predictions
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'grades' ? "Search by course name..." : "Search predictions..."}
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
            <Ionicons name="trash-outline" size={20} color={colors.background} />
            <Text style={styles.actionButtonText}>Delete ({selectedItems.size})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.exportButton]} 
            onPress={handleExportSelected}
          >
            <Ionicons name="download-outline" size={20} color={colors.background} />
            <Text style={styles.actionButtonText}>Export ({selectedItems.size})</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{studentData.currentGpa.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Current GPA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{studentData.currentCwa.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Current CWA</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{studentData.totalCredits}</Text>
            <Text style={styles.statLabel}>Total Credits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{studentData.grades.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
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
            <Text style={styles.emptyTitle}>No grades recorded yet</Text>
            <Text style={styles.emptyText}>
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
              <View style={styles.chipsContainer}>
                {grades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.chip,
                      newGrade.grade === grade && styles.chipSelected
                    ]}
                    onPress={() => setNewGrade(prev => ({ ...prev, grade }))}
                  >
                    <Text style={[
                      styles.chipText,
                      newGrade.grade === grade && { color: colors.background }
                    ]}>
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Credits *</Text>
              <TextInput
                style={styles.inputField}
                value={newGrade.credits}
                onChangeText={(text) => setNewGrade(prev => ({ ...prev, credits: text }))}
                placeholder="Enter credit hours"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Semester</Text>
              <TextInput
                style={styles.inputField}
                value={newGrade.semester}
                onChangeText={(text) => setNewGrade(prev => ({ ...prev, semester: text }))}
                placeholder="e.g. Fall 2024"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={() => setShowAddGrade(false)}
              >
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.buttonPrimary]} 
                onPress={handleAddGrade}
              >
                <Text style={styles.buttonText}>Add Grade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Grade Modal */}
      <Modal visible={showEditGrade} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Course</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Name</Text>
              <TextInput
                style={styles.inputField}
                value={editingGrade?.courseName || ''}
                onChangeText={(text) => setEditingGrade(prev => ({ ...prev, courseName: text }))}
                placeholder="Enter course name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Code</Text>
              <TextInput
                style={styles.inputField}
                value={editingGrade?.courseCode || ''}
                onChangeText={(text) => setEditingGrade(prev => ({ ...prev, courseCode: text }))}
                placeholder="Enter course code"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Grade</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editingGrade?.grade || ''}
                  style={styles.picker}
                  onValueChange={(itemValue) => setEditingGrade(prev => ({ ...prev, grade: itemValue }))}
                >
                  <Picker.Item label="Select Grade" value="" />
                  {grades.map(grade => (
                    <Picker.Item key={grade} label={grade} value={grade} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Credits</Text>
              <TextInput
                style={styles.inputField}
                value={editingGrade?.credits?.toString() || ''}
                onChangeText={(text) => setEditingGrade(prev => ({ ...prev, credits: text }))}
                placeholder="Enter credits"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Semester</Text>
              <TextInput
                style={styles.inputField}
                value={editingGrade?.semester || ''}
                onChangeText={(text) => setEditingGrade(prev => ({ ...prev, semester: text }))}
                placeholder="e.g., Fall 2023"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={() => {
                  setShowEditGrade(false);
                  setEditingGrade(null);
                }}
              >
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.buttonPrimary]} 
                onPress={handleSaveEditedGrade}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.base,
    backgroundColor: colors.background,
    marginTop: spacing.md,
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    margin: spacing.sm,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.background,
    fontWeight: typography.semibold,
  },
  listItem: {
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  listItemMeta: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  gradeBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  gradeText: {
    color: colors.background,
    fontWeight: typography.bold,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: typography['4xl'],
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
  inputField: {
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
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: typography.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.backgroundSecondary,
  },
  buttonText: {
    color: colors.background,
    fontWeight: typography.semibold,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  activeTab: {
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  tabText: {
    marginLeft: spacing.xs,
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  selectionActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  exportButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    color: colors.background,
    fontWeight: typography.semibold,
    marginLeft: spacing.xs,
  },
  selectedItem: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  selectionIndicator: {
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
  },

  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  editActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  editActionButtonText: {
    color: colors.background,
    fontSize: typography.base,
    fontWeight: typography.bold,
    marginLeft: spacing.xs,
  },
  selectionModeText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontStyle: 'italic',
  },
  clearSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
  },
  clearSelectionText: {
    color: colors.primary,
    fontSize: typography.sm,
    marginLeft: spacing.xs,
    fontWeight: typography.medium,
  },

});
