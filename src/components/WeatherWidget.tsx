import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
  }[];
}

const weatherIcons: Record<number, typeof Sun> = {
  0: Sun, 1: Sun, 2: Cloud, 3: Cloud,
  45: Cloud, 48: Cloud,
  51: CloudRain, 53: CloudRain, 55: CloudRain,
  61: CloudRain, 63: CloudRain, 65: CloudRain,
  71: CloudSnow, 73: CloudSnow, 75: CloudSnow,
  80: CloudRain, 81: CloudRain, 82: CloudRain,
  95: CloudRain, 96: CloudRain, 99: CloudRain,
};

const weatherLabels: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Light showers", 81: "Showers", 82: "Heavy showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Severe storm",
};

const getWeatherIcon = (code: number) => weatherIcons[code] || Cloud;

interface WeatherWidgetProps {
  lat: number;
  lng: number;
}

const WeatherWidget = ({ lat, lng }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
        );
        const data = await res.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: data.current.relative_humidity_2m,
          weatherCode: data.current.weather_code,
          daily: data.daily.time.map((date: string, i: number) => ({
            date,
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
          })),
        });
      } catch {
        console.error("Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="h-8 bg-muted rounded w-1/3 mb-4" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded flex-1" />
          ))}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const CurrentIcon = getWeatherIcon(weather.weatherCode);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Current Weather</h3>

      <div className="flex items-center gap-4 mb-4">
        <CurrentIcon className="h-10 w-10 text-primary" />
        <div>
          <p className="text-3xl font-bold text-card-foreground">{weather.temperature}°C</p>
          <p className="text-sm text-muted-foreground">{weatherLabels[weather.weatherCode] || "Unknown"}</p>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground mb-5">
        <div className="flex items-center gap-1">
          <Wind className="h-3.5 w-3.5" /> {weather.windSpeed} km/h
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5" /> {weather.humidity}%
        </div>
      </div>

      <h4 className="text-sm font-semibold text-card-foreground mb-3">5-Day Forecast</h4>
      <div className="grid grid-cols-5 gap-2">
        {weather.daily.map((day) => {
          const DayIcon = getWeatherIcon(day.weatherCode);
          const dayName = new Date(day.date).toLocaleDateString("en", { weekday: "short" });
          return (
            <div key={day.date} className="text-center bg-muted/50 rounded-lg p-2">
              <p className="text-xs text-muted-foreground mb-1">{dayName}</p>
              <DayIcon className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-xs font-medium text-card-foreground">{day.tempMax}°</p>
              <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherWidget;
