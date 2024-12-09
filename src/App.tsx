//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2' 
import './App.css'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';

interface Indicator {
  title?: String;
  subtitle?: String;  
  value?: String;
}

function App() {
  //const [count, setCount] = useState(0)
    {/* Variable de estado y función de actualización */}
    let [indicators, setIndicators] = useState<Indicator[]>([])
    //let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
    let [items, setItems] = useState<Item[]>([])
    useEffect(() => {
      let request = async () => {
        let API_KEY = "74378b4b73518d16f213233942298cdf"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTexXML = await response.text();

        let dataToItems : Item[] = new Array<Item>();

        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTexXML, "application/xml");

        let dataToIndicators: Indicator[] = new Array<Indicator>();
        {/* 
            Análisis, extracción y almacenamiento del contenido del XML 
            en el arreglo de resultados
        */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let timeArray = xml.getElementsByTagName("time");
        let time = Array.from(timeArray).slice(0,6);

        let precipitationArray = xml.getElementsByTagName("precipitation");
        let precipitation = Array.from(precipitationArray).slice(0,6);

        let humidityArray = xml.getElementsByTagName("humidity");
        let humidity = Array.from(humidityArray).slice(0,6);

        let cloudsArray = xml.getElementsByTagName("clouds");
        let clouds = Array.from(cloudsArray).slice(0,6);

        for(let i=0;i<6;i++){
          let fromString = time[i].getAttribute("from") || "";
          let from =  fromString.split("T",2)[1];
          console.log(from);
          let toString = time[i].getAttribute("to") || "";
          let to = toString.split("T",2)[1];
          let probability = precipitation[i].getAttribute("probability") || "";
          let value = humidity[i].getAttribute("value") || "";
          let all = clouds[i].getAttribute("all") || "";
          dataToItems.push({"dateStart":from,"dateEnd":to,"precipitation":probability,"humidity":value,"clouds":all});
          console.log("dateStart"+ from + " dateEnd" + to  + " precipitation "  + probability  + " humidity "  +  value  + " clouds "  + all)
        }
        setItems(dataToItems);
        
        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })


        setIndicators(dataToIndicators);

      }

      request();

    }, [])

    let renderIndicators = () => {

      return indicators
              .map(
                  (indicator, idx) => (
                      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                          <IndicatorWeather 
                              title={indicator["title"]} 
                              subtitle={indicator["subtitle"]} 
                              value={indicator["value"]} />
                      </Grid>
                  )
              )
        
    }

    return (

      <Grid container spacing={5}>

        {renderIndicators()}
        {/* Tabla */}
        <Grid size={{ xs: 12, xl: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, xl: 3 }}>
              <ControlWeather />
            </Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              <TableWeather itemsIn ={items} />
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 4 }}>
          <LineChartWeather />
        </Grid>

      </Grid>
    )
    }

export default App