# GradePred - AI-Powered GPA/CWA Predictor

A React Native mobile application that uses machine learning to predict academic performance (GPA/CWA) based on student data.

## 🚀 Features

- **Authentication System**: Complete login/signup with persistent sessions
- **GPA Prediction**: Predict Grade Point Average using ML models
- **CWA Prediction**: Predict Cumulative Weighted Average
- **Academic Insights**: Personalized recommendations and insights
- **History Tracking**: View prediction history and trends
- **Offline Mode**: Works without backend server using fallback algorithms

## 📱 App Structure

### Authentication Flow
1. **Welcome Screen** → Choose "Get Started" or "Sign In"
2. **Sign Up/Login** → Create account or sign in
3. **Main App** → Access GPA/CWA predictors

### Main Screens
- **Predict Tab**: Choose between GPA and CWA prediction
- **History Tab**: View prediction history
- **Insights Tab**: Academic insights and recommendations
- **Settings**: User profile and logout

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Python 3.7+ (for backend)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Backend Setup (Optional)
```bash
# Navigate to backend directory
cd Backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

## 🔧 Configuration

### Backend URL
The app is configured to connect to `http://localhost:5000/api` by default. If your backend is running on a different address, update the `API_BASE_URL` in `MLContext.js`.

### Offline Mode
The app includes fallback prediction algorithms that work without the backend server. This ensures the app remains functional even when the ML server is unavailable.

## 🐛 Troubleshooting

### Network Errors
If you see "Failed to fetch model performance" errors:
- The app will automatically use fallback prediction algorithms
- These errors don't affect core functionality
- To eliminate errors, start the backend server

### Authentication Issues
- Clear app data if login/signup stops working
- Check that AsyncStorage is properly configured
- Restart the app if needed

### Backend Connection
- Ensure Python is installed and accessible
- Check that port 5000 is available
- Verify all backend dependencies are installed

## 📊 ML Models

The backend uses three machine learning models:
- **Linear Regression**: Fast, interpretable predictions
- **Random Forest**: Robust, handles non-linear relationships
- **XGBoost**: High accuracy, ensemble learning

### Fallback Algorithm
When backend is unavailable, the app uses a simplified prediction algorithm based on:
- Current GPA/CWA
- Study hours
- Attendance rate
- Course performance

## 🎯 Usage

1. **Create Account**: Sign up with email and password
2. **Choose Predictor**: Select GPA or CWA prediction
3. **Enter Data**: Fill in academic information and courses
4. **Get Prediction**: View predicted score and insights
5. **Track Progress**: Monitor predictions over time

## 🔒 Security

- User data is stored locally using AsyncStorage
- No sensitive data is transmitted without encryption
- Backend API includes proper validation and error handling

## 📈 Performance

- **Frontend**: React Native with optimized rendering
- **Backend**: Flask with async processing
- **ML Models**: Pre-trained models for fast predictions
- **Caching**: Local storage for offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the console logs for errors
3. Ensure all dependencies are installed
4. Verify network connectivity

---

**Note**: The app works in both online and offline modes. Backend server is optional for basic functionality.
