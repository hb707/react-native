import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location'
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height } = Dimensions.get('window')
const API_KEY = '02670cb24fe0030e8e73981ceeec34f6'
const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: 'rain',
    Thunderstorm: 'light'
}

export default function App() {
    const [region, setRegion] = useState('Loading');
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);
    const getWeather = async () => {
        // 위치정보 접근허가받기
        // request어쩌고 실행하면 반환되는 객체의 granted 속성에 불리언으로 허가여부 반환됨
        // 이 값에 따라서 
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) setOk(false)
        // coords의 latitude와 longitude값만 가져옴
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
        setRegion(location[0].street)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
        const json = await response.json(); // 왜 비동기?
        setDays(json.daily);
    }
    useEffect(() => {
        getWeather()
    }, [])
    return (
        <>
            <StatusBar style='light' />
            <View style={styles.container}>
                <View style={styles.city}>
                    <Text style={styles.cityname}>{region}</Text>
                </View>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerstyle={styles.weather}>
                    {days.length === 0
                        ? (
                            <View style={{ ...styles.day, alignItems: 'center' }}>
                                <ActivityIndicator
                                    color="white"
                                    size="large"
                                    style={{ marginTop: 100 }} />
                            </View>
                        )
                        : (
                            days.map((day, index) => (
                                <View key={index} style={styles.day}>
                                    <View style={styles.tempView}>
                                        <Text style={styles.temperature}>
                                            {parseFloat(day.temp.day).toFixed(1)}
                                        </Text>
                                        <Fontisto name={icons[day.weather[0].main]} size={50} color="#cecece" style={{ marginTop: 50 }} />
                                    </View>
                                    <Text style={styles.description}>{day.weather[0].main}</Text>
                                    <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                                </View>
                            )
                            )
                        )
                    }

                </ScrollView>
            </View >
        </>
    );
}

// 그냥 객체이지만 자동완성기능이 있어서 편리함!
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#831814'
    },
    city: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cityname: {
        fontSize: 68,
        fontWeight: '500',
        color: '#cecece'
    },
    weather: {
        flex: 3
    },
    day: {
        width: SCREEN_WIDTH,
        alignItems: 'flex-start',
        padding: 30,
    },
    temperature: {
        fontSize: 100,
        marginTop: 50,
        color: '#cecece'
    },
    description: {
        fontSize: 60,
        marginTop: -30,
        color: '#cecece'
    },
    tinyText: {
        fontSize: 20,
        color: '#cecece'
    },
    tempView: {
        width: SCREEN_WIDTH * 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
