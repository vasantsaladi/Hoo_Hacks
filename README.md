# Food Waste Predictor

![Food Waste Predictor](image.png)

## 🌱 Project Overview

Food Waste Predictor is a data science solution designed to help restaurants and food businesses reduce waste through advanced predictive modeling. By leveraging machine learning algorithms and statistical analysis, our system accurately forecasts potential food waste based on multiple data sources and provides data-driven insights for inventory optimization.

## 🚀 Key Features

### 📊 Data Science & Predictive Modeling

- **78% Prediction Accuracy**: Our Random Forest model achieves 78% accuracy in predicting food waste quantities
- **Feature Importance Analysis**: Utilization Rate (78%), Quantity of Food (8%), Number of Guests (5%)
- **Multi-dataset Integration**: Combines restaurant data, regional waste statistics, and shelf life information
- **Advanced Feature Engineering**: Derived metrics including waste-per-guest ratio and utilization rates

### 📈 Data Visualization & Analytics

- **CO2 Emissions Tracking**: Quantitative analysis of environmental impact
- **Seasonal Waste Pattern Analysis**: Time-series forecasting of waste patterns
- **Utilization Rate Metrics**: Statistical correlation between utilization and waste

### 💹 Financial Impact Analysis

- **ROI Projections**: Data-driven 5-year financial forecasting
- **Cost Breakdown Analytics**: Statistical distribution of waste-related expenses
- **Savings Projection Models**: Comparative analysis of current vs. optimized costs
- **Investment Scenario Modeling**: Statistical comparison of investment options with calculated payback periods

## 🔧 Technical Architecture

### 🧠 Data Science & ML Pipeline

- **Model Architecture**: Random Forest Regressor optimized through GridSearchCV
- **Feature Engineering Pipeline**:
  - Shelf life data extraction and normalization
  - Food category standardization with custom mapping algorithm
  - Weather data integration via API
  - Statistical derivation of utilization metrics
- **Model Performance**: Mean Absolute Error of 0.04
- **Cross-validation**: K-fold validation to ensure model robustness

### 🔄 Data Processing

- **ETL Pipeline**: Automated extraction, transformation, and loading of multiple data sources
- **Data Cleaning**: Outlier detection and handling of missing values
- **Feature Selection**: Statistical significance testing for optimal feature selection
- **Data Normalization**: Standardization of numerical features and one-hot encoding of categorical variables

### 🖥️ Visualization Framework

- **Interactive Dashboards**: Dynamic data representation with Recharts
- **Statistical Plots**: Time-series, distribution, and correlation visualizations
- **Metric Cards**: Key performance indicators with statistical context
- **Comparative Analysis Views**: Before/after optimization metrics

## 📊 Data Sources

- Restaurant waste data (7,500+ records)
- Brooklyn food waste statistics (regional benchmark data)
- Product shelf life database (2,000+ food items)
- Weather data correlation analysis

## 🛠️ Installation & Setup

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
   uvicorn app.main:app --reload
   ```

4. Frontend setup:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/docs

## 🏆 Impact Potential

- **Data-Driven Savings**: Statistical model projects average ROI of 280% in the first year
- **Environmental Impact**: Quantitative analysis shows potential to reduce CO2 emissions by up to 2.5kg per kg of food saved
- **Operational Efficiency**: Data analysis indicates payback period of approximately 3 months for implementation costs

_Food Waste Predictor - Data-driven solutions for food waste reduction._
