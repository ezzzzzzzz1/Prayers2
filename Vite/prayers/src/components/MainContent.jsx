import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import fajrPrayerImg from '../assets/fajr-prayer.png.jpg';
import DohrPrayerImg from '../assets/dhhr-prayer-mosque.png';
import AsrPrayerImg from '../assets/asr-prayer-mosque.png';
import MaghrbPrayerImg from '../assets/sunset-prayer-mosque.png';
import EshaPrayerImg from '../assets/night-prayer-mosque.png';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import { useEffect, useState } from 'react';
import moment from 'moment';
import "moment/dist/locale/ar-dz";
moment.locale("ar");


export default function MainContent() {
    
   
    //States
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    const [remainingTime,setremainingTime]=useState("")
    const [timings, setTimings] = useState({
        Fajr: "04:19",
            Dhuhr: "11:51", 
            Asr: "15:20",
            Sunset: "18:05",
            Isha: "19:35"
    })
    const [selectedCity, setSelectedCity] = useState({
        displayName: "القاهرة",
        apiName: "Cairo",
        
    })
    const [today, setToday] = useState()
    // const [timer,setTimer]=useState(10)
    const availableCities = [{
        displayName: "الاسكندرية",
        apiName: "Alexandria",
    },
    {
        displayName: "بورسعيد",
        apiName: "PortSaid",
    }
        ,
        {
            displayName: "اسوان ",
            apiName: "Aswan",
        },
        {
            displayName: "القاهرة ",
            apiName: "Cairo",
        }
        
        
        
    
    ]
    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr",displayName:"الظهر"},
        { key: "Asr",displayName:"العصر"},
        { key: "Sunset",displayName:"المغرب"},
        { key: "Isha",displayName:"العشاء"},

    ]
    const getTimings = async () => {
            const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName }`)
            setTimings(response.data.data.timings);
        
    }
useEffect(() => {
    getTimings();    
}, [selectedCity])

    useEffect(() => {
        let interval = setInterval(() => {
            setUpCountdownTimer();
       
        }, 1000);
        const t = moment();
        setToday(t.format("MMM Do YYYY | h:mm"));
        return () => {
            clearInterval(interval);
        };
   
    }, [timings]);
    const setUpCountdownTimer = () => {
        const momentNow = moment();
        let prayerIndex = 2;
        if (momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
            prayerIndex = 1;
        } else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
            prayerIndex = 2;
            
        }
        else if(momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))) {
            prayerIndex = 3;
        }
        else if(momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) && momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
            prayerIndex = 4;
        }
            
        else{ 
            prayerIndex = 0;;
        }
        // console.log(momentNow.isBefore(IshaMoment));
        setNextPrayerIndex(prayerIndex);
        //now after knowing what the next prayer is , we can setup the countdown timer by getting the prayer's time
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("23:59:59", "hh:mm"))
            const totalDifference = midnightDiff + fajrToMidnightDiff;
            remainingTime = totalDifference;
            
        }
        console.log(remainingTime);
        const durartionRemainingTime = moment.duration(remainingTime);
        setremainingTime(`${durartionRemainingTime.hours()}:${durartionRemainingTime.minutes()}:${durartionRemainingTime.seconds()}`)

        // setremainingTime(`${durartionRemainingTime.seconds()}:${durartionRemainingTime.minutes()}:${durartionRemainingTime.hours()}`)
        // console.log("duration",durartionRemainingTime.hours(),durartionRemainingTime.minutes(),durartionRemainingTime.seconds());
        
        

   }
//    const data = await axios.get("https://api.aladhan.com/v1/timingsByCity?country=SA&city=Makkah al Mukarramah")
    const handleCityChange = (event) => {
        const cityObject = availableCities.find((city) => {
            return city.apiName == event.target.value;
        })
        console.log(event.target.value);
         setSelectedCity(cityObject)
      };
  return (
      <>
          <Grid container>
              <Grid xs={6}>
                  <div>
                      <h2>{today}</h2>
                      <h1>{selectedCity.displayName}</h1>
                  </div>
              </Grid>
              <Grid xs={6}>
                  <div>
                      <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                      <h1>{remainingTime}</h1>
                  </div>
              </Grid>

          </Grid>
          <Divider />
          
          {/* prayers cards */}
              
          <Stack direction="row" justifyContent="space-around" style={{ marginTop: "50px", paddingLeft: "1.5rem" }} >
              <div style={{ justifyContent: "space-around", display: "flex", marginBottom: "50px" }}>
                  <div style={{ paddingLeft: "5px" }} >
                      <Prayer name="الفجر" time={timings.Fajr} image={fajrPrayerImg} /> </div>
                      <div style={{paddingLeft:"5px"}} >
                  
                      <Prayer name="الظهر" time={timings.Dhuhr} image={DohrPrayerImg} />   </div> 
                      <div style={{paddingLeft:"5px"}} >

                      <Prayer name="العصر" time={timings.Asr} image={AsrPrayerImg} />    </div>
                      <div style={{paddingLeft:"5px"}} >

                      <Prayer name="المغرب" time={timings.Sunset} image={MaghrbPrayerImg} />    </div>

                  <Prayer name="العشاء" time={timings.Isha} image={EshaPrayerImg} />
 </div>                 
              </Stack>

                    {/* prayers cards */}
          <Stack direction='row' justifyContent={"center"} style={{marginTop:"20px"}}>
              <FormControl style={{ width:"20%"}}>
        <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
                  <Select
                       style={{color:"white"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        //   value={age}
          label="Age"
          onChange={handleCityChange}
                  >
                      {availableCities.map((city) => {
                          return (
                              <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>

                          )
                      })}
       
        </Select>
      </FormControl>
          </Stack>

      </>
  )
}
