# WasteWatch: Predicting and Reducing Food Waste

## Inspiration

Food waste is a massive problem - **$254 billion** is lost annually across restaurants, grocery stores, and schools. The largest portion, **$62 billion**, comes from restaurants, while many people still struggle with food insecurity. Restaurants alone generate between 22 to 33 billion pounds of food waste each year. In fact, **4–10%** of food purchased by restaurants is wasted before it ever reaches the customer.

We decided to change that. We created a web application powered by machine learning to help restaurants predict and reduce food waste. By leveraging technology, we provide custom solutions that help restaurants save money and increase profits.

## What Does Our Application Do?

WasteWatch is a predictive tool that takes into account:

- Location and environmental factors
- Food type and quantity
- Number of guests
- Storage conditions
- Historical sales data

Our interactive dashboard allows restaurants to view the generated analysis and receive solution recommendations tailored to their unique needs.

## Key Features

- **Predictive Analytics**: Machine learning model with 78% accuracy
- **Interactive Dashboard**: Real-time waste metrics and visualization
- **Actionable Recommendations**: Custom waste reduction strategies
- **Environmental Impact Tracking**: CO2 emissions and water usage metrics

## Financial Analytics

- **ROI Projections**: Data-driven 5-year financial forecasting
- **Cost Breakdown Analytics**: Statistical distribution of waste-related expenses
- **Savings Projection Models**: Comparative analysis of current vs. optimized costs payback periods

## Technical Architecture

- **Machine Learning Core**: Random Forest Regressor trained on 7,500+ restaurant waste records
- **Feature Engineering Pipeline**:
  - Shelf life data extraction and normalization
  - Food category standardization with custom mapping algorithm
  - Statistical derivation of utilization metrics
- **Model Performance**: Mean Absolute Error of 0.04
- **Cross-validation**: K-fold validation to ensure model robustness

## How We Built It (Data Science)

We built a predictive food waste management platform by combining machine learning, data integration, and interactive visualizations. Using over 7,500 restaurant waste records, regional statistics, shelf-life data, and real-time inputs, we engineered features like utilization rate and waste-per-guest ratio.

After cleaning and preprocessing the data, we trained a Random Forest Regressor achieving **78%** prediction accuracy. We optimized the models, connected them to real-time data feeds, and built a user-friendly dashboard.

## Challenges We Ran Into

- **Data Quality**: Handling messy data cleaning and organizing datasets with missing or inconsistent values
- **Seasonal Fluctuations**: Designing an adaptive model to handle unpredictable demand patterns
- **User Experience**: Creating a powerful yet easy-to-use tool for non-technical users

## Accomplishments We're Proud Of

- Building a user-friendly interface that enables non-technical users to make data-driven decisions
- Developing a system that integrates with real-time data for continuous optimization
- Creating a solution with measurable environmental and financial impact

## What We Learned

- **Data Quality Matters**: The accuracy of the model heavily depends on the variety and reliability of data sources
- **Simplicity is Key**: Clear, actionable insights are just as important as accurate predictions
- **Technology Can Drive Sustainability**: Small optimizations in inventory management can lead to major reductions in food waste

## What's Next for WasteWatch?

- **Smart Alerts**: Notifications when food is nearing expiration
- **Grocery Store Partnerships**: Integrations with suppliers to adjust inventory in real time
- **AI-Powered Learning**: Models that improve continuously based on restaurant feedback and usage patterns

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/WasteWatch.git
   cd WasteWatch
   ```

2. Set up the backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. Set up the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/docs

## Impact Potential

- **Data-Driven Savings**: Statistical model projects average ROI of 280% in the first year
- **Environmental Impact**: Quantitative analysis shows potential to reduce CO2 emissions by up to 2.5kg per kg of food saved
- **Operational Efficiency**: Data analysis indicates payback period of approximately 3 months for implementation costs

## Final Thoughts

WasteWatch isn't just about predicting food waste - it's about empowering restaurants to make smarter, more sustainable choices. With machine learning and real-time data, we're transforming food waste into optimized inventory management, lower costs, and a greener planet!

**Less waste. More savings. A smarter future.**
