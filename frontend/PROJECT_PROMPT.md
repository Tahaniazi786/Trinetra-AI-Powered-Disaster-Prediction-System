# TRINETRA - AI Disaster Prediction & Management System
## Complete Project Prompt

---

## 🌍 PROJECT OVERVIEW

Create a comprehensive AI-powered Disaster Prediction and Management Platform called **TRINETRA** that predicts and monitors natural disasters including:
- 🌊 Floods
- ⛰️ Landslides  
- 🌀 Cyclones
- 🏜️ Droughts

The system analyzes real-time weather data (rainfall, humidity, temperature, wind speed, pressure) using Machine Learning to calculate disaster risk scores (0-100%).

**Core Goal**: Provide early warning system for disaster preparedness and save lives through predictive analytics.

---

## 🎨 DESIGN REQUIREMENTS

### Color Scheme
- Primary: Dark Blue (#1e293b, #0f172a)
- Accent: Blue (#3b82f6) and Cyan (#22d3ee)
- Alerts: Red (#ef4444), Orange (#f97316), Yellow (#eab308)
- Background: Dark gradient from slate-900 via blue-900 to slate-900

### UI Style
- Modern AI dashboard aesthetic
- Dark theme with glowing accents
- Card-based layout with blur effects
- Smooth animations and transitions
- Responsive design for desktop and mobile

---

## 📱 PAGES & FEATURES

### 1. HOME PAGE (/)
**Hero Section:**
- Large TRINETRA logo/icon (Cloud icon)
- Title: "AI Disaster Prediction System"
- Subtitle: "Real-time AI powered disaster monitoring and prediction platform"
- Two CTA buttons: "Start Prediction" and "View Dashboard"

**Features Section:**
- 3 feature cards with icons:
  - Real-Time Prediction (Activity icon)
  - Interactive Map (Map icon)
  - Emergency Alerts (Bell icon)

**Monitored Disasters:**
- 4 disaster type cards with emojis:
  - 🌊 Floods
  - ⛰️ Landslides
  - 🌀 Cyclones
  - 🏜️ Droughts

**How It Works:**
- 3-step process visualization:
  1. Data Collection
  2. AI Analysis
  3. Alert & Visualize

### 2. DASHBOARD PAGE (/dashboard)
**Statistics Cards (4 cards):**
- Monitored Locations count
- High Risk Zones count
- Average Risk Score
- Active Alerts count

**Disaster Type Distribution:**
- 4 small cards showing count for each disaster type

**Charts (using Recharts):**
1. **Rainfall Trends** - Area chart showing last 7 days rainfall vs average
2. **Temperature Trends** - Line chart showing temperature over time
3. **Risk Trends by Type** - Multi-line chart showing all disaster types

**Data Tables:**
- High Risk Locations list with details
- Recent Disaster Events with affected population

### 3. PREDICTION PAGE (/prediction)
**Input Form:**
- Rainfall (mm) input
- Humidity (%) input (0-100)
- Temperature (°C) input
- Wind Speed (km/h) input
- Pressure (hPa) input (optional)
- "Predict Disaster Risk" button

**Quick Example Buttons:**
- Flood Scenario (rainfall: 180, humidity: 85, temp: 28, wind: 15)
- Cyclone Scenario (rainfall: 120, humidity: 90, temp: 26, wind: 75)
- Normal Weather (rainfall: 40, humidity: 60, temp: 25, wind: 12)

**Results Display:**
- Risk Score percentage with colored progress bar
- Disaster Type detected
- Risk Level: Low/Moderate/High/Critical
- Confidence percentage
- Color-coded result card:
  - Green: Low Risk (0-29%)
  - Yellow: Moderate Risk (30-59%)
  - Orange: High Risk (60-84%)
  - Red: Critical (85-100%)

**Safety Recommendations:**
- Dynamic list based on disaster type and risk level
- Emergency actions for high/critical risks

### 4. MAP PAGE (/map)
**Interactive Map (using Leaflet.js):**
- Map centered on India (lat: 20.5937, lng: 78.9629, zoom: 5)
- OpenStreetMap tiles
- Custom markers for 10 locations across India:
  - Mumbai, Chennai, Kolkata, Delhi, Bangalore
  - Shillong, Ahmedabad, Bhubaneswar, Jaipur, Kerala Coast

**Marker Colors:**
- 🟢 Green: Low Risk (0-39%)
- 🟡 Yellow: Moderate Risk (40-59%)
- 🟠 Orange: High Risk (60-79%)
- 🔴 Red: Critical Risk (80-100%)

**Location Details Panel:**
- Click marker to show details
- Display: location name, state, risk score, disaster type
- Weather parameters: rainfall, temperature, humidity, wind speed
- Last updated timestamp
- Safety alerts for high-risk locations

**Locations List:**
- Sidebar with all monitored locations
- Click to zoom map to that location

### 5. ABOUT PAGE (/about)
**Sections:**
1. **Mission Statement** - Project goals and purpose
2. **Technology Stack** - Frontend and Backend technologies
3. **Data Sources** - OpenWeatherMap API, NASA GPM API
4. **Machine Learning Model**:
   - Model Type: Random Forest Classifier
   - Input Features: rainfall, humidity, temperature, wind speed, pressure
   - Output: risk score, disaster type, recommendations
5. **Core Features** - 4 key features with icons
6. **Target Users** - 8 user categories
7. **Monitored Disasters** - Details on 4 disaster types
8. **Future Enhancements** - Planned improvements

---

## 🤖 AI PREDICTION LOGIC

### Algorithm (Simulated Random Forest):
```
Calculate individual risk factors:
- rainfallRisk: Based on rainfall amount (>200mm = 100%, <50mm = 10%)
- humidityRisk: Based on humidity (>95% = 95%, <60% = 5%)
- temperatureRisk: Extremes are risky (<10°C or >42°C)
- windRisk: Based on wind speed (>80km/h = 100%, <20km/h = 10%)
- pressureRisk: Deviation from 1013 hPa

Weighted Risk Score:
riskScore = (rainfallRisk × 0.35) + (humidityRisk × 0.25) + 
            (temperatureRisk × 0.15) + (windRisk × 0.15) + 
            (pressureRisk × 0.10)
```

### Disaster Type Detection:
- **Cyclone**: High wind (>60 km/h) + High humidity (>80%)
- **Flood**: Heavy rain (>150mm) + High humidity (>75%)
- **Landslide**: Very heavy rain (>180mm) + Moderate temp (15-30°C)
- **Drought**: Low rain (<30mm) + Low humidity (<40%) + High temp (>35°C)

### Risk Levels:
- **Low**: 0-29% (Green)
- **Moderate**: 30-59% (Yellow)
- **High**: 60-84% (Orange)
- **Critical**: 85-100% (Red)

---

## 📊 MOCK DATA

### 10 Location Data Points:
Each location includes:
- ID, name, state, coordinates (lat/lng)
- Risk score, disaster type
- Rainfall, temperature, humidity, wind speed
- Last updated timestamp

**Example Locations:**
1. Mumbai - High flood risk (78%)
2. Chennai - Cyclone risk (65%)
3. Shillong - Landslide risk (82%)
4. Bhubaneswar - Cyclone risk (88%)
5. Delhi - Normal (25%)
6. Bangalore - Normal (20%)
... etc.

### Chart Data:
- 7 days of rainfall data
- 7 days of temperature data
- 7 days of risk trends (4 disaster types)
- 5 recent disaster events

---

## 🛠️ TECHNICAL IMPLEMENTATION

### Required Packages:
```json
{
  "react-router": "For routing",
  "recharts": "For charts",
  "leaflet": "For maps",
  "react-leaflet": "React wrapper for Leaflet",
  "lucide-react": "For icons"
}
```

### File Structure:
```
/src/app/
├── App.tsx                          # Router provider
├── routes.tsx                       # Route configuration
├── components/
│   ├── Layout.tsx                   # Navigation + footer
│   └── DisasterMap.tsx              # Leaflet map component
├── pages/
│   ├── HomePage.tsx                 # Landing page
│   ├── Dashboard.tsx                # Analytics dashboard
│   ├── PredictionPage.tsx           # Prediction form
│   ├── MapPage.tsx                  # Map page
│   └── AboutPage.tsx                # About page
├── utils/
│   └── disasterPrediction.ts        # ML simulation logic
└── data/
    └── mockData.ts                  # Mock location & chart data
```

### Key Components:

#### Layout Component:
- Sticky navigation with 5 links (Home, Dashboard, Predict, Map, About)
- Active route highlighting
- Dark themed with blue accents
- Footer with copyright

#### Prediction Calculator:
- Input validation for all parameters
- Real-time calculation on button click
- 1 second simulated delay for "AI processing"
- Dynamic result cards based on risk level
- Safety recommendations generation

#### Interactive Map:
- Leaflet map with custom markers
- Color-coded pins based on risk level
- Popup on marker click
- Detail panel for selected location
- Location list with click-to-zoom

#### Charts:
- Responsive Recharts components
- Custom colors matching theme
- Tooltips with dark styling
- Legends for multi-line charts
- Grid lines and proper axis labels

---

## 🎯 USER INTERACTIONS

1. **Homepage**: Click CTAs → Navigate to Dashboard or Prediction
2. **Dashboard**: View analytics, scroll through charts and data tables
3. **Prediction Page**: 
   - Enter weather parameters manually OR
   - Click example scenario buttons
   - Click "Predict" to see results
   - View recommendations
4. **Map Page**:
   - Click markers to see location details
   - Click locations in sidebar to zoom map
   - View risk legend
5. **About Page**: Read project information

---

## 🚨 ALERT SYSTEM

### Alert Triggers:
- Display warning when risk level is "High" or "Critical"
- Different alert colors based on severity
- Emergency recommendations displayed prominently

### Alert Levels:
- **Low**: Continue normal activities with awareness
- **Moderate**: Prepare emergency supplies, monitor updates
- **High**: ⚠️ Avoid travel, stay informed, prepare to evacuate
- **Critical**: 🚨 IMMEDIATE ACTION - Follow evacuation orders

---

## 📈 SAFETY RECOMMENDATIONS

### Base Recommendations (All levels):
- Monitor weather updates regularly
- Keep emergency contact numbers ready

### Moderate Risk:
- Prepare emergency supplies (food, water, medicine)
- Check drainage systems
- Secure loose objects

### High/Critical Risk:
- Evacuate to safer locations if advised
- Keep emergency kit ready
- Avoid travel unless necessary
- Stay indoors away from windows

### Disaster-Specific:
**Flood/Heavy Rain:**
- Move to higher ground
- Avoid floodwater
- Disconnect electrical appliances

**Cyclone/Strong Winds:**
- Secure doors and windows
- Stay in strongest part of building
- Move away from coastal areas

**Landslide:**
- Evacuate hilly areas immediately
- Listen for unusual sounds
- Move to stable ground

**Drought/Heat Wave:**
- Conserve water
- Stay hydrated
- Check on vulnerable individuals

---

## 🎨 STYLING GUIDELINES

### Cards:
```css
bg-slate-800/50 border-blue-500/30
backdrop-blur-sm
rounded-lg
p-6
hover:border-blue-500 transition-colors
```

### Buttons:
```css
Primary: bg-blue-600 hover:bg-blue-700 text-white
Outline: border-blue-400 text-blue-400 hover:bg-blue-950
```

### Risk Colors:
- Low: green-400, green-500, green-950
- Moderate: yellow-400, yellow-500, yellow-950
- High: orange-400, orange-500, orange-950
- Critical: red-400, red-500, red-950

### Icons:
- Use lucide-react icons throughout
- Size: h-5 w-5 for inline, h-12 w-12 for features
- Colors match the theme (blue-400, cyan-400, etc.)

---

## 🔮 FUTURE ENHANCEMENTS

1. Real backend integration with FastAPI
2. Actual ML model deployment (Random Forest Classifier)
3. Real-time API connections (OpenWeatherMap, NASA GPM)
4. SMS and email alerts
5. Mobile applications (iOS/Android)
6. Government dashboard with admin controls
7. Disaster relief coordination system
8. Multi-language support
9. Historical data analysis and reporting
10. Community feedback system

---

## 📝 IMPLEMENTATION NOTES

### Data Flow:
1. User inputs weather parameters
2. Prediction function calculates risk using weighted algorithm
3. Disaster type determined by conditions
4. Results displayed with appropriate styling
5. Recommendations generated based on risk/type

### State Management:
- Use React useState for form inputs
- Store prediction results in component state
- Selected location state for map interaction
- No global state needed

### Performance:
- Lazy load chart data
- Optimize map rendering
- Debounce input changes if needed
- Use React.memo for heavy components

### Accessibility:
- Semantic HTML tags
- ARIA labels for icons
- Keyboard navigation support
- Color contrast for readability
- Screen reader friendly alerts

---

## ✅ PROJECT CHECKLIST

- [ ] Install required packages: react-router, recharts, leaflet, react-leaflet, lucide-react
- [ ] Set up routing with 5 pages
- [ ] Create Layout with navigation and footer
- [ ] Build HomePage with hero, features, and CTAs
- [ ] Build Dashboard with stats cards and charts
- [ ] Build PredictionPage with form and results
- [ ] Implement prediction algorithm in utils
- [ ] Build MapPage with Leaflet integration
- [ ] Create mock location data (10 locations)
- [ ] Build AboutPage with project details
- [ ] Add custom markers to map
- [ ] Implement click interactions on map
- [ ] Style all components with dark theme
- [ ] Add responsive design for mobile
- [ ] Test all user flows
- [ ] Add alert system for high risks
- [ ] Generate safety recommendations
- [ ] Add loading states and animations
- [ ] Test on different screen sizes
- [ ] Add proper TypeScript types
- [ ] Final styling polish

---

## 🎓 LEARNING OUTCOMES

This project demonstrates:
- React Router for multi-page applications
- Interactive data visualization with Recharts
- Map integration with Leaflet
- Simulated ML prediction algorithms
- Complex state management
- Responsive UI design
- TypeScript interfaces
- Component composition
- Dark theme implementation
- Risk calculation algorithms

---

## 🚀 DEPLOYMENT

The application is a frontend-only demo with simulated backend. For production:
1. Set up FastAPI backend
2. Train and deploy ML model
3. Integrate real weather APIs
4. Set up database (SQLite/PostgreSQL)
5. Implement authentication
6. Add API rate limiting
7. Deploy frontend (Vercel/Netlify)
8. Deploy backend (Heroku/Railway)
9. Set up monitoring and logging
10. Configure CORS and security

---

## 📄 LICENSE & CREDITS

- OpenStreetMap for map tiles
- OpenWeatherMap for weather data concept
- NASA GPM for rainfall data concept
- Lucide for icons
- Recharts for charts
- Leaflet for maps

---

**END OF PROJECT PROMPT**

Use this complete specification to build the TRINETRA AI Disaster Management System.
