import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { 
  generateHash, 
  generateChecksum, 
  verifyDataIntegrity, 
  generateGradeHash,
  generatePredictionHash,
  generateBatchHash,
  verifyHash,
  generateSalt,
  generateSaltedHash
} from '../utils/hashing';

/**
 * Test component to demonstrate hashing functionality
 * This component shows various hashing operations and their results
 */
const HashTestComponent = () => {
  const [testData, setTestData] = useState('Sample data for hashing');
  const [hashResult, setHashResult] = useState('');
  const [checksumResult, setChecksumResult] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [saltResult, setSaltResult] = useState('');
  const [saltedHashResult, setSaltedHashResult] = useState('');

  // Test basic hashing
  const testBasicHash = async () => {
    try {
      const hash = await generateHash(testData);
      setHashResult(hash);
    } catch (error) {
      setHashResult(`Error: ${error.message}`);
    }
  };

  // Test checksum generation
  const testChecksum = async () => {
    try {
      const sampleData = {
        name: 'John Doe',
        gpa: 3.5,
        credits: 45,
        timestamp: new Date().toISOString()
      };
      const checksum = await generateChecksum(sampleData);
      setChecksumResult(checksum);
    } catch (error) {
      setChecksumResult(`Error: ${error.message}`);
    }
  };

  // Test data integrity verification
  const testDataIntegrity = async () => {
    try {
      const originalData = { test: 'data', number: 42 };
      const checksum = await generateChecksum(originalData);
      
      // Verify with same data
      const isValid = await verifyDataIntegrity(originalData, checksum);
      setVerificationResult(`Original data valid: ${isValid}`);
      
      // Verify with modified data
      const modifiedData = { test: 'data', number: 43 };
      const isModifiedValid = await verifyDataIntegrity(modifiedData, checksum);
      setVerificationResult(prev => `${prev}\nModified data valid: ${isModifiedValid}`);
    } catch (error) {
      setVerificationResult(`Error: ${error.message}`);
    }
  };

  // Test grade hashing
  const testGradeHash = async () => {
    try {
      const gradeData = {
        courseName: 'Mathematics',
        courseCode: 'MATH101',
        grade: 'A',
        credits: 3,
        semester: 'Fall 2024',
        timestamp: new Date().toISOString()
      };
      const hash = await generateGradeHash(gradeData);
      setHashResult(`Grade Hash: ${hash}`);
    } catch (error) {
      setHashResult(`Error: ${error.message}`);
    }
  };

  // Test prediction hashing
  const testPredictionHash = async () => {
    try {
      const predictionData = {
        predicted_gpa: 3.7,
        confidence: 85,
        timestamp: new Date().toISOString(),
        inputData: { study_hours: 20, attendance: 90 }
      };
      const hash = await generatePredictionHash(predictionData);
      setHashResult(`Prediction Hash: ${hash}`);
    } catch (error) {
      setHashResult(`Error: ${error.message}`);
    }
  };

  // Test batch hashing
  const testBatchHash = async () => {
    try {
      const dataArray = [
        { id: 1, value: 'first', timestamp: '2024-01-01T00:00:00Z' },
        { id: 2, value: 'second', timestamp: '2024-01-02T00:00:00Z' },
        { id: 3, value: 'third', timestamp: '2024-01-03T00:00:00Z' }
      ];
      const hash = await generateBatchHash(dataArray);
      setHashResult(`Batch Hash: ${hash}`);
    } catch (error) {
      setHashResult(`Error: ${error.message}`);
    }
  };

  // Test salt generation
  const testSaltGeneration = () => {
    try {
      const salt = generateSalt(16);
      setSaltResult(salt);
    } catch (error) {
      setSaltResult(`Error: ${error.message}`);
    }
  };

  // Test salted hashing
  const testSaltedHashing = async () => {
    try {
      const salt = generateSalt(16);
      const data = 'sensitive information';
      const saltedHash = await generateSaltedHash(data, salt);
      setSaltedHashResult(`Salt: ${salt}\nSalted Hash: ${saltedHash}`);
    } catch (error) {
      setSaltedHashResult(`Error: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hashing Functionality Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Input Data</Text>
        <TextInput
          style={styles.input}
          value={testData}
          onChangeText={setTestData}
          placeholder="Enter test data"
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Hashing</Text>
        <TouchableOpacity style={styles.button} onPress={testBasicHash}>
          <Text style={styles.buttonText}>Generate Hash</Text>
        </TouchableOpacity>
        {hashResult ? (
          <Text style={styles.result}>Hash: {hashResult}</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Checksum Generation</Text>
        <TouchableOpacity style={styles.button} onPress={testChecksum}>
          <Text style={styles.buttonText}>Generate Checksum</Text>
        </TouchableOpacity>
        {checksumResult ? (
          <Text style={styles.result}>Checksum: {checksumResult}</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Integrity Verification</Text>
        <TouchableOpacity style={styles.button} onPress={testDataIntegrity}>
          <Text style={styles.buttonText}>Test Integrity</Text>
        </TouchableOpacity>
        {verificationResult ? (
          <Text style={styles.result}>{verificationResult}</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Grade Data Hashing</Text>
        <TouchableOpacity style={styles.button} onPress={testGradeHash}>
          <Text style={styles.buttonText}>Hash Grade Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prediction Hashing</Text>
        <TouchableOpacity style={styles.button} onPress={testPredictionHash}>
          <Text style={styles.buttonText}>Hash Prediction Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Batch Hashing</Text>
        <TouchableOpacity style={styles.button} onPress={testBatchHash}>
          <Text style={styles.buttonText}>Hash Batch Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salt Generation</Text>
        <TouchableOpacity style={styles.button} onPress={testSaltGeneration}>
          <Text style={styles.buttonText}>Generate Salt</Text>
        </TouchableOpacity>
        {saltResult ? (
          <Text style={styles.result}>Salt: {saltResult}</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salted Hashing</Text>
        <TouchableOpacity style={styles.button} onPress={testSaltedHashing}>
          <Text style={styles.buttonText}>Generate Salted Hash</Text>
        </TouchableOpacity>
        {saltedHashResult ? (
          <Text style={styles.result}>{saltedHashResult}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
});

export default HashTestComponent;
