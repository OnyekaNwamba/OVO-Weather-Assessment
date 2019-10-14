//API Endpoint
const api_url = 'https://openweathermap.org/data/2.5/forecast?id=524901&appid=b6907d289e10d714a6e88b30761fae22';

function start() {
    //start function to get city name
    getCity();
    //start function to create table
    createTable(getDaysTemp(),getHumid());
}

async function getCity() {

    const response = await fetch(api_url);
    const json = await response.json();

    let city = document.getElementById('city');
    const cityName =  json.city;
    console.log(cityName.name);
    city.innerHTML = cityName.name.toString();

}


async function getDaysTemp() {

    //Fetching JSON from endpoint
    const response = await fetch(api_url);
    const json = await response.json();

    let daysList = json.list;

    //dictionary of days and their highest temperatures
    let daysTempDict = {};

    for(let i=0; i<daysList.length; i++) {

        //get timestamp from list of days for each hour
        let timestamp = daysList[i].dt;

        let fullDate = timeStampToDate(timestamp);

        //get temperature for 3 every hours
        let currentTemperature = daysList[i].main.temp_max;

        if(fullDate in daysTempDict) {
            let maxTemp = daysTempDict[fullDate];
            if(currentTemperature > maxTemp) {
                daysTempDict[fullDate] = currentTemperature;
            }
        } else {
            daysTempDict[fullDate] = currentTemperature;
        }

    }

    return daysTempDict;

}


async function getHumid() {
    //creating JSON from endpoint
    const response = await fetch(api_url);
    const json = await response.json();

    let daysList = json.list;

    //dictionary of days and their humidity,days recorded
    //KEY: Date
    //VALUE:[totalhumidity,days_recorded]
    let daysHumidity = {};

    let x = 0;
    for(let i=0; i<daysList.length; i++) {

        //get timestamp from list of days for each hour
        let timestamp = daysList[i].dt;

        //convert timestamp to date
        let fullDate = timeStampToDate(timestamp);

        //get temperature for 3 every hours
        let humidity = daysList[i].main.humidity;
        //console.log(date.getDate());

        if(fullDate in daysHumidity) {
            //get information on humidity from date
            let humidityInfo = daysHumidity[fullDate];

            //get total humidity
            let totalHumidity =  humidityInfo[0];

            //add current humidity to total humidity
            totalHumidity = totalHumidity + humidity;

            //increment days recorded
            humidityInfo[1] = humidityInfo[1] + 1;

            //update totalHumidity
            humidityInfo[0] = totalHumidity;
            daysHumidity[fullDate] = humidityInfo;
        } else {
            //create new humidity info
            daysHumidity[fullDate] = [humidity,1];
        }

    }

    return daysHumidity;

}

async function createTable(daysTemp, daysHumidity) {

    //Wait for Promise
    daysTemp = await daysTemp;
    daysHumidity = await daysHumidity;

    let table = document.getElementById('table');
    let i = 1;

    for(let day in daysTemp) {

        let humidityInfo = daysHumidity[day];
        let averageHumidity = humidityInfo[0] / humidityInfo[1];
        let maxTemp = daysTemp[day];
        let date = day;

        console.log(daysTemp);

        //New row of information
        let newRow = table.insertRow(-1);
        let n = newRow.insertCell(0);
        let dateCell = newRow.insertCell(-1);
        let maxCell = newRow.insertCell(-1);
        let humidCell = newRow.insertCell(-1);

        n.innerHTML = i;
        dateCell.innerHTML = date;
        maxCell.innerHTML = maxTemp + ' °C';
        humidCell.innerHTML = Math.round(averageHumidity*100.00)/100.00 + "%";

        i++;

    }


}

function timeStampToDate(timestamp) {
    // Months array
    const months_arr = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];

    // Convert timestamp to milliseconds
    let date = new Date(timestamp*1000);

    // Year
    let year = date.getFullYear();

    // Month
    let month = months_arr[date.getMonth()];

    // Day
    let day = date.getDate();


    let fullDate = day + " " + month + " " + year;

    return fullDate;
}
