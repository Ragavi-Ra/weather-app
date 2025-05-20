import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { WEATHER_API_KEY } from '@env';
import { NEWS_API_KEY } from '@env';

const Home = ({ navigation }: any) => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingnews, setLoadingnews] = useState(true);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);

  const FetchWeather = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=Namakkal&days=5&aqi=no&alerts=no`);
      //Free plan is only fetching forcaste upto 3 days
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
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();
  return json.articles;
};

useEffect(() => {
  if (!weather) return;

  const currentTemp = weather?.current?.temp_c;
  const query = getNewsQueryForWeather(currentTemp);

  setLoadingnews(true);
  fetchNews(query)
    .then(setNewsArticles)
    .catch((err) => console.error("Error fetching news:", err))
    .finally(() => setLoadingnews(false));
}, [weather]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />
  }

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <View style={{marginBottom: 20}}>
      <Text>Location: {weather?.location.name}, {weather?.location.region}</Text>
      <Text>Temperature: {weather?.current.temp_c} °C / {weather?.current.temp_f} °F</Text>
      <Text>Condition: {weather?.current.condition.text}</Text>

      <FlatList
  data={forecast}
  keyExtractor={(item) => item.date}
  ListHeaderComponent={() => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableCell, styles.headerText]}>Date</Text>
      <Text style={[styles.tableCell, styles.headerText]}>Condition</Text>
      <Text style={[styles.tableCell, styles.headerText]}>Temp (°C)</Text>
    </View>
  )}
  renderItem={({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, {flex:1}]}>{item.date}</Text>
      
      <Text style={[styles.tableCell, {flex:2}]}>{item.day.condition.text}
        {/* <Image
        source={{ uri: 'https:' + item.day.condition.icon }}
        style={[styles.icon]}
      /> */}
      </Text>
      <Text style={[styles.tableCell, {flex:1}]}>
        {item.day.maxtemp_c} / {item.day.mintemp_c}
      </Text>
    </View>
  )}
/>
</View>

<Text style={{ fontSize: 18, marginTop: 20, fontWeight: 'bold' }}>News Based on Weather</Text>
{loadingnews ? (
  <ActivityIndicator size="small" />
) : (
  <FlatList
    data={newsArticles}
    keyExtractor={(item) => item.url}
    renderItem={({ item }) => (
      <View style={{ marginVertical: 8 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    )}
  />
)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex:1
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  headerText: {
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
  height: 30,
  resizeMode: 'contain', // or 'cover'
  borderRadius: 5,
  alignSelf: 'center',
  },
});

export default Home;
