import { sha256 } from 'react-native-sha256';
import { Buffer } from 'buffer';

/**
 * Hashing utility functions for GradePred application
 * Provides secure hashing for passwords, data integrity, and checksums
 */

/**
 * Generate SHA-256 hash for data integrity
 * @param {string|object} data - Data to hash
 * @returns {Promise<string>} - SHA-256 hash
 */
export const generateHash = async (data) => {
  try {
    let dataString;
    
    if (typeof data === 'object') {
      dataString = JSON.stringify(data);
    } else {
      dataString = String(data);
    }
    
    const hash = await sha256(dataString);
    return hash;
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Failed to generate hash');
  }
};

/**
 * Generate checksum for data validation
 * @param {object} data - Data object to checksum
 * @returns {Promise<string>} - Checksum hash
 */
export const generateChecksum = async (data) => {
  try {
    // Sort keys to ensure consistent ordering
    const sortedData = Object.keys(data)
      .sort()
      .reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {});
    
    const dataString = JSON.stringify(sortedData);
    const checksum = await sha256(dataString);
    
    return checksum;
  } catch (error) {
    console.error('Checksum generation error:', error);
    throw new Error('Failed to generate checksum');
  }
};

/**
 * Verify data integrity using stored checksum
 * @param {object} data - Data to verify
 * @param {string} storedChecksum - Previously stored checksum
 * @returns {Promise<boolean>} - True if data is intact
 */
export const verifyDataIntegrity = async (data, storedChecksum) => {
  try {
    const currentChecksum = await generateChecksum(data);
    return currentChecksum === storedChecksum;
  } catch (error) {
    console.error('Data integrity verification error:', error);
    return false;
  }
};

/**
 * Generate hash for grade data with timestamp
 * @param {object} gradeData - Grade information
 * @returns {Promise<string>} - Grade data hash
 */
export const generateGradeHash = async (gradeData) => {
  try {
    const gradeString = `${gradeData.courseName}-${gradeData.courseCode}-${gradeData.grade}-${gradeData.credits}-${gradeData.semester}-${gradeData.timestamp}`;
    const hash = await sha256(gradeString);
    return hash;
  } catch (error) {
    console.error('Grade hash generation error:', error);
    throw new Error('Failed to generate grade hash');
  }
};

/**
 * Generate hash for prediction data
 * @param {object} predictionData - Prediction information
 * @returns {Promise<string>} - Prediction data hash
 */
export const generatePredictionHash = async (predictionData) => {
  try {
    const predictionString = `${predictionData.predicted_gpa}-${predictionData.confidence}-${predictionData.timestamp}-${JSON.stringify(predictionData.inputData)}`;
    const hash = await sha256(predictionString);
    return hash;
  } catch (error) {
    console.error('Prediction hash generation error:', error);
    throw new Error('Failed to generate prediction hash');
  }
};

/**
 * Generate hash for user session
 * @param {string} userId - User identifier
 * @param {string} timestamp - Session timestamp
 * @returns {Promise<string>} - Session hash
 */
export const generateSessionHash = async (userId, timestamp) => {
  try {
    const sessionString = `${userId}-${timestamp}-${Date.now()}`;
    const hash = await sha256(sessionString);
    return hash;
  } catch (error) {
    console.error('Session hash generation error:', error);
    throw new Error('Failed to generate session hash');
  }
};

/**
 * Generate hash for configuration data
 * @param {object} config - Configuration object
 * @returns {Promise<string>} - Configuration hash
 */
export const generateConfigHash = async (config) => {
  try {
    const configString = JSON.stringify(config);
    const hash = await sha256(configString);
    return hash;
  } catch (error) {
    console.error('Config hash generation error:', error);
    throw new Error('Failed to generate config hash');
  }
};

/**
 * Generate hash for multiple data items
 * @param {Array} dataArray - Array of data items
 * @returns {Promise<string>} - Combined hash
 */
export const generateBatchHash = async (dataArray) => {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Invalid data array');
    }
    
    // Sort array by timestamp for consistency
    const sortedArray = dataArray.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    const combinedString = sortedArray
      .map(item => JSON.stringify(item))
      .join('|');
    
    const hash = await sha256(combinedString);
    return hash;
  } catch (error) {
    console.error('Batch hash generation error:', error);
    throw new Error('Failed to generate batch hash');
  }
};

/**
 * Generate hash for file content
 * @param {string} content - File content
 * @param {string} filename - File name
 * @returns {Promise<string>} - File hash
 */
export const generateFileHash = async (content, filename) => {
  try {
    const fileString = `${filename}-${content}-${Date.now()}`;
    const hash = await sha256(fileString);
    return hash;
  } catch (error) {
    console.error('File hash generation error:', error);
    throw new Error('Failed to generate file hash');
  }
};

/**
 * Verify hash matches expected value
 * @param {string} data - Data to hash
 * @param {string} expectedHash - Expected hash value
 * @returns {Promise<boolean>} - True if hash matches
 */
export const verifyHash = async (data, expectedHash) => {
  try {
    const actualHash = await generateHash(data);
    return actualHash === expectedHash;
  } catch (error) {
    console.error('Hash verification error:', error);
    return false;
  }
};

/**
 * Generate salt for enhanced security
 * @param {number} length - Salt length (default: 16)
 * @returns {string} - Random salt string
 */
export const generateSalt = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return salt;
};

/**
 * Generate salted hash for sensitive data
 * @param {string} data - Data to hash
 * @param {string} salt - Salt to use
 * @returns {Promise<string>} - Salted hash
 */
export const generateSaltedHash = async (data, salt) => {
  try {
    const saltedData = `${data}${salt}`;
    const hash = await sha256(saltedData);
    return hash;
  } catch (error) {
    console.error('Salted hash generation error:', error);
    throw new Error('Failed to generate salted hash');
  }
};

export default {
  generateHash,
  generateChecksum,
  verifyDataIntegrity,
  generateGradeHash,
  generatePredictionHash,
  generateSessionHash,
  generateConfigHash,
  generateBatchHash,
  generateFileHash,
  verifyHash,
  generateSalt,
  generateSaltedHash
};
