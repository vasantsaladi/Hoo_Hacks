# Food Waste Predictor 🌱

A machine learning-powered application that helps restaurants and food service operations predict and reduce food waste, saving money and reducing environmental impact.

![Food Waste Predictor](https://i.imgur.com/YourScreenshotHere.png)

## 🚀 Features

- **Accurate Waste Prediction**: ML model trained on real restaurant data to predict food waste
- **Financial Impact Analysis**: See the direct cost savings from reducing waste
- **Personalized Recommendations**: AI-generated, actionable recommendations specific to your operation
- **Environmental Impact**: Track CO2 emissions reduction from your waste prevention efforts
- **Interactive Visualizations**: Clear data presentation with charts and metrics

## 💻 Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend**: FastAPI, Python
- **ML/AI**: Scikit-learn, OpenAI API
- **Data Processing**: Pandas, NumPy

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/food-waste-predictor.git
   cd food-waste-predictor
   ```

2. Create and set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. Backend setup:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Frontend setup:
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python main.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 📊 Demo Data

For demonstration purposes, you can use the following sample inputs:

- **Food Type**: Vegetables
- **Number of Guests**: 300
- **Event Type**: Corporate
- **Storage Condition**: Refrigerated
- **Preparation Method**: Fresh
- **Location**: Urban
- **Pricing Tier**: Premium

## 🧠 How It Works

1. **Data Collection**: User inputs key parameters about their food service operation
2. **Prediction**: ML model analyzes inputs to predict waste amounts
3. **Analysis**: System calculates financial and environmental impact
4. **Recommendations**: AI generates personalized waste reduction strategies
5. **Visualization**: Results are displayed in an intuitive, actionable format

## 🔒 Security Notes

- API keys are stored in environment variables (not in code)
- No personal data is collected or stored
- OpenAI API usage is limited to generating recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- [Team Member 1](https://github.com/teammember1)
- [Team Member 2](https://github.com/teammember2)
- [Team Member 3](https://github.com/teammember3)

---

*Created for HooHacks 2023*
