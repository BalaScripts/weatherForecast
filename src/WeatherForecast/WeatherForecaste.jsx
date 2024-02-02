import { useState } from "react";
import Button from "@mui/material/Button";
import { Card, Divider, TextField } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Axios from "axios";
import { Cloud, WbSunny, Opacity, CloudOutlined } from "@mui/icons-material"; 
import moment from "moment";

const KEY = "ad4f32f6e2e63709a38b6d50bd12c7d1";

const WeatherForecaste = () => {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [data, setData] = useState();
  const [unit, setUnit] = useState("metric"); 

  const fetchData = async () => {
    try {
      const tempresponse = await Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${KEY}`
      );
      setData(tempresponse.data);
      console.log(tempresponse.data);

      const forecastresponse = await Axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${KEY}`
      );
      setForecastData(forecastresponse.data.list);
      console.log(forecastresponse.data.list);
    } catch (err) {
      alert("Invalid City Name");
    }
  };

  const handleUnitChange = (event, newUnit) => {
    if (newUnit) {
      setUnit(newUnit);
    }
  };

  const convertToFahrenheit = (temp) => {
    return temp * (9 / 5) + 32;
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "Clear":
        return <WbSunny className="!text-[yellow] !text-5xl " />;
      case "Clouds":
        return <Cloud className="!text-sky-500 !text-5xl" />;
      case "Rain":
        return <Opacity className="!text-white !text-5xl" />;
      default:
        return <CloudOutlined className="!text-sky-500  !text-5xl" />;
    }
  };

  const filterForecastByDate = (data) => {
    const filteredForecast = [];
    const uniqueDates = [];

    data.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!uniqueDates.includes(date)) {
        uniqueDates.push(date);
        filteredForecast.push(item);
      }
    });

    return filteredForecast;
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-black  flex  !flex-wrap justify-center items-center">
        <Card className="p-2 flex flex-wrap justify-center items-center gap-4 mt-5">
          <div className="bg-transparent text-3xl p-1 text-black text-center">
            WEATHER FORECAST
          </div>
          <TextField
            className="!bg-white !text-white"
            size="small"
            label="City"
            placeholder="Enter City Name"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button
            className="w-12  h-9 !bg-black !text-white !rounded-lg !capitalize"
            onClick={fetchData}
            variant="contained"
          >
            Check
          </Button>

          <ToggleButtonGroup
            size="small"
            value={unit}
            exclusive
            onChange={handleUnitChange}
            aria-label="temperature unit"
            className="flex gap-4 justify-center items-center"
          >
            <ToggleButton
              className="!bg-black !text-white !capitalize  !text-sm !rounded-lg"
              value="metric"
              aria-label="celsius"
            >
              Temp in °C
            </ToggleButton>
            <ToggleButton
              className="!bg-black !text-white !capitalize  !text-sm !rounded-lg"
              value="imperial"
              aria-label="fahrenheit"
            >
              Temp in °F
            </ToggleButton>
          </ToggleButtonGroup>
        </Card>

        <Card className="flex !bg-transparent  p-5">
          {data && (
            <div className="">
              <div className="!text-4xl   mb-4 flex items-center justify-center">
                <div className="!text-white mt-14 font-semibold">
                  {getWeatherIcon(data.weather[0].main)} {data.name}{" "}
                  {data.sys.country}{" "}
                  {Math.round(
                    unit === "metric"
                      ? data.main.temp
                      : convertToFahrenheit(data.main.temp)
                  )}{" "}
                  {unit === "metric" ? "°C" : "°F"}
                </div>
              </div>
              <div className="bg-black !flex !flex-col items-center  font-semibold font-sans">
                <div className="!text-white text-lg">
                  {data.weather[0].description}
                </div>
                <div className="!text-white text-xl">
                  {moment().format("dddd")}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Card className="!bg-transparent !text-white !rounded-full !shadow-2xl shadow-blue-500 p-5">
                  Humidity: {Math.round(data.main.humidity)} %
                  <div>
                    <Divider />
                  </div>
                  Weather: {data.weather[0].description}
                </Card>
                <Card className="!bg-transparent !text-white !rounded-full p-5">
                  Wind speed: {Math.round(data.wind.speed)} km/h
                  <div>
                    <Divider />
                  </div>
                  Wind Direction: {Math.round(data.wind.deg)} °
                </Card>
                <Card className="!bg-transparent !text-white !rounded-full p-5">
                  Max Temp:{" "}
                  {Math.round(
                    unit === "metric"
                      ? data.main.temp_max
                      : convertToFahrenheit(data.main.temp_max)
                  )}{" "}
                  {unit === "metric" ? "°C" : "°F"}
                  <div>
                    <Divider />
                  </div>
                  Min Temp:{" "}
                  {Math.round(
                    unit === "metric"
                      ? data.main.temp_min
                      : convertToFahrenheit(data.main.temp_min)
                  )}{" "}
                  {unit === "metric" ? "°C" : "°F"}
                </Card>
              </div>
            </div>
          )}
        </Card>

        <div className="!bg-black flex !flex-wrap">
          {forecastData.length > 0 && (
            <div className="flex flex-wrap !justify-evenly rounded-lg  ">
              {filterForecastByDate(forecastData).map((forecast, index) => (
                <div key={index} className="p-5">
                  <div className="flex flex-col gap-1 items-center">
                    {getWeatherIcon(forecast.weather[0].main)}

                    <div className="!text-white">
                      Temp:{" "}
                      {Math.round(
                        unit === "metric"
                          ? forecast.main.temp
                          : convertToFahrenheit(forecast.main.temp)
                      )}{" "}
                      {unit === "metric" ? "°C" : "°F"}
                    </div>
                    <div className="!text-white">
                      {forecast.weather[0].description}
                    </div>
                    <div className="!text-white ml-2">
                      {new Date(forecast.dt * 1000).toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherForecaste;
