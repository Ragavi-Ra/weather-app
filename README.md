# Weather + News App

A cross-platform mobile app built with **React Native (CLI)** and **TypeScript** that displays weather forecasts and intelligently fetches news articles based on current weather conditions.

---

## Features

- Live location-based weather forecast (3-day, because more than 3 days is paid version).
- Real-time temperature and weather conditions.
- Smart news feed filtered by weather mood:
  - Hot → News related to fear/war/conflict.
  - Cold → News related to depression/loss/tragedy.
  - Moderate → News related to celebration/success/happy stories.
- Fully responsive UI.
- Clean and structured component design.
- Used React Context API for global state management
- Manages user preferences like temperature unit (Celsius/Fahrenheit) and news categories
- Preferences are updated via the Settings page
- Changes in preferences automatically update temperature display across the app
- News content is fetched dynamically based on updated user preferences

---

## Tech Stack

- React Native CLI
- TypeScript
- WeatherAPI (for weather)
- NewsAPI (for news)
- Native Location and permission

---