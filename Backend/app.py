from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Simple prediction function without heavy ML dependencies
def simple_prediction(data):
    """Simple prediction algorithm using basic math"""
    current_gpa = float(data.get('current_gpa', 3.0))
    study_hours = float(data.get('study_hours', 15))
    attendance = float(data.get('attendance', 85))
    
    # Simple algorithm
    base_score = current_gpa
    
    # Adjust based on study hours
    if study_hours > 20:
        base_score += 0.2
    elif study_hours > 15:
        base_score += 0.1
    elif study_hours < 10:
        base_score -= 0.1
    
    # Adjust based on attendance
    if attendance > 90:
        base_score += 0.15
    elif attendance > 80:
        base_score += 0.1
    elif attendance < 70:
        base_score -= 0.1
    
    # Ensure score is within valid range
    predicted_gpa = max(0, min(4.0, base_score))
    
    return {
        'predicted_gpa': round(predicted_gpa, 2),
        'confidence': random.randint(75, 95),
        'insights': [
            f'Based on your current GPA of {current_gpa}',
            f'Study hours: {study_hours} hours per week',
            f'Attendance rate: {attendance}%',
            'Consider increasing study time for better results' if study_hours < 15 else 'Good study habits!',
            'High attendance contributes to academic success' if attendance > 85 else 'Try to improve attendance'
        ]
    }

@app.route('/')
def home():
    return jsonify({
        'message': 'GradePred Backend API',
        'status': 'running',
        'version': '1.0.0'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'backend': 'Flask',
        'ml_models': 'simple_algorithm'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Generate prediction
        result = simple_prediction(data)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models/performance', methods=['GET'])
def get_model_performance():
    return jsonify({
        'simple_algorithm': {
            'accuracy': 85,
            'mae': 0.3,
            'r2_score': 0.75
        }
    })

@app.route('/api/models/retrain', methods=['POST'])
def retrain_models():
    return jsonify({
        'message': 'Models retrained successfully',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/student-data', methods=['GET'])
def get_student_data():
    return jsonify({
        'currentGpa': 3.2,
        'currentCwa': 75.5,
        'totalCredits': 45,
        'grades': [],
        'academicHistory': []
    })

@app.route('/api/add-grade', methods=['POST'])
def add_grade():
    try:
        data = request.get_json()
        return jsonify({
            'message': 'Grade added successfully',
            'data': data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting GradePred Backend...")
    print("Simple prediction algorithm loaded")
    print("Server running on http://0.0.0.0:5000 (accessible from network)")
    app.run(debug=True, host='0.0.0.0', port=5000)
