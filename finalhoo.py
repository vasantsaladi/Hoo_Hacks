import pandas as pd
import requests

def get_location():
    ip_url = "https://ipinfo.io"
    response = requests.get(ip_url)
    data = response.json()
    location = data['loc'].split(',')
    lat, lon = location[0], location[1]
    city = data.get('city', 'Unknown')  # Get city from the response, default to 'Unknown'
    return lat, lon, city  # Return city instead of country

def get_weather_by_location(lat, lon):
    # Define the Open Meteo URL with the latitude and longitude
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"

    # Make the request
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()

        # Define the weather code mapping
        weather_codes = {
            0: "Clear",
            1: "Partly Cloudy",
            2: "Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing Rime Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Heavy Drizzle",
            # Add more mappings as needed
        }

        # Extract weather data (e.g., temperature, humidity)
        temperature = data['current_weather']['temperature']  # Temperature in Celsius
        humidity = data['current_weather']['windspeed']  # Windspeed in km/h
        weather_code = data['current_weather']['weathercode']  # Weather code
        
        # Get weather description from the weather code
        weather_description = weather_codes.get(weather_code, "Unknown Weather Code")
        
        return temperature, humidity, weather_description
    else:
        print("Error retrieving weather data.")
        return None

# Example: Get weather for the user's location
lat, lon, city = get_location()
weather_data = get_weather_by_location(lat, lon)

if weather_data:
    print(f"Temperature: {weather_data[0]}°C")
    print(f"Windspeed: {weather_data[1]} km/h")
    print(f"Weather Description: {weather_data[2]}")

# Load your sales and holidays data
sales_df = pd.read_csv('NationalTotalAndSubcategory.csv')  # Adjust path to your sales data
holidays_df = pd.read_csv('United States_US.csv')  # Adjust path to your holidays data

# Step 1: Clean the Date column if necessary (convert to datetime format if not already)
# Use errors='coerce' to handle invalid parsing
sales_df['Date'] = pd.to_datetime(sales_df['Date'], errors='coerce')
holidays_df['Date'] = pd.to_datetime(holidays_df['Date'], errors='coerce')

# Step 2: Handle duplicate holiday entries per date
holidays_df = holidays_df.groupby('Date').agg({
    'Name': lambda x: ', '.join(set(x)),  # Concatenate unique holiday names
    'Type': lambda x: ', '.join(set(x))    # Concatenate unique holiday types
}).reset_index()

# Step 3: Ask the user for their age and gender
user_age = int(input("Please enter your age: "))
user_gender = input("Please enter your gender (M/F): ").strip().upper()

# Step 4: Create user features using the retrieved city and user input
user_features = {
    'User _Location': city,  # Use the city retrieved from the location
    'User _Age': user_age,   # User's age from input
    'User _Gender': user_gender  # User's gender from input
}

# Create a DataFrame for the user features
user_df = pd.DataFrame(user_features, index=[0])

# You can now use user_df separately in your analysis or modeling
print("User  Information:")
print(user_df)

# You can also print the sales and holidays data separately
print("Sales Data:")
print(sales_df.head())

print("Holidays Data (after handling duplicates):")
print(holidays_df.head())