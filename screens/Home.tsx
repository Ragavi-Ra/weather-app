import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { WEATHER_API_KEY, NEWS_API_KEY } from '@env';
import useLiveLocation from '../LiveLocation';

const Home = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingnews, setLoadingnews] = useState(true);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const location = useLiveLocation();

  const FetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
      );
      const data = await response.json();
      setWeather(data);
      setForecast(data.forecast.forecastday);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNewsQueryForWeather = (temperature: number) => {
    if (temperature >= 30) return 'fear OR war OR conflict';
    if (temperature <= 20) return 'depression OR loss OR tragedy';
    return 'happy OR celebration OR success OR win';
  };

  const fetchNews = async (query: string) => {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.articles;
  };

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      FetchWeather(latitude, longitude);
    }
  }, [location]);

  useEffect(() => {
    if (!weather) return;
    const currentTemp = weather?.current?.temp_c;
    const query = getNewsQueryForWeather(currentTemp);

    setLoadingnews(true);
    fetchNews(query)
      .then(setNewsArticles)
      .catch((err) => console.error('Error fetching news:', err))
      .finally(() => setLoadingnews(false));
  }, [weather]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.weatherContainer}>
        <Text style={styles.locationText}>
          {weather?.location.name}, {weather?.location.region}
        </Text>
        <Text style={styles.tempText}>
          {weather?.current.temp_c} °C / {weather?.current.temp_f} °F
        </Text>
        <Text style={styles.conditionText}>
          {weather?.current.condition.text}
        </Text>
        <Image
          source={{ uri: 'https:' + weather?.current.condition.icon }}
          style={styles.weatherIcon}
        />
      </View>

      <Text style={styles.sectionTitle}>3-Day Forecast</Text>
      <FlatList
        data={forecast}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={styles.conditionRow}>
              <Image
                source={{ uri: 'https:' + item.day.condition.icon }}
                style={styles.forecastIcon}
              />
              <Text style={styles.forecastCondition}>
                {item.day.condition.text}
              </Text>
            </View>
            <Text style={styles.tempRange}>
              {item.day.maxtemp_c}° / {item.day.mintemp_c}°
            </Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>News Based on Weather</Text>
      {loadingnews ? (
        <ActivityIndicator size="small" />
      ) : (
        newsArticles.map((article, index) => (
          <View key={index} style={styles.newsCard}>
            <Text style={styles.newsTitle}>{article.title}</Text>
            <Text style={styles.newsDescription}>{article.description}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f6f8fa',
    paddingBottom: 50,
  },
  weatherContainer: {
    backgroundColor: '#007BFF10',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tempText: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 4,
  },
  conditionText: {
    fontSize: 16,
    color: '#444',
  },
  weatherIcon: {
    width: 64,
    height: 64,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  forecastItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateText: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  forecastIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  forecastCondition: {
    fontSize: 14,
    color: '#555',
  },
  tempRange: {
    fontSize: 14,
    color: '#333',
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 13,
    color: '#444',
  },
});
