// d1845658f92b31c64bd94f06f7188c9c
const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-conatiner")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

// initial needs
let oldTab=userTab
const API_KEY="d1845658f92b31c64bd94f06f7188c9c"
oldTab.classList.add("current-tab") 
getfromSessionStorage()
function switchTab(newTab){
if(newTab!=oldTab){
    oldTab.classList.remove("current-tab")
    oldTab=newTab
    oldTab.classList.add("current-tab")
    if(!searchForm.classList.contains("active")){
        //kya search form wala conatiner is invsible toh visible karo
        userInfoContainer.classList.remove("active")
        grantAccessContainer.classList.remove("active")
        searchForm.classList.add("active")
    }
    else{
        //phele search tab pr the ab user tab pr jana ha
        searchForm.classList.remove("active")
        grantAccessContainer.classList.remove("active")
        userInfoContainer.classList.add("active")
        //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        
    }
}

} 

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

// check if coordinates are already presennt in session storage 
function getfromSessionStorage(){
const localCoordinates=sessionStorage.getItem("user-coordinates")
if(!localCoordinates){
    //agar local coordinates nhi mile
    grantAccessContainer.classList.add("active")
}
else{
    const coordinates=JSON.parse(localCoordinates)
    fetchUserWeatherInfo(coordinates)
}
}

 async function fetchUserWeatherInfo(coordinates){
const {lat,lon}=coordinates
//make grantaccceddcont invis
grantAccessContainer.classList.remove("active")
//make loader visible
loadingScreen.classList.add("active")

//API call
try{
const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
const data= await response.json()
loadingScreen.classList.remove("active")
userInfoContainer.classList.add("active")
renderWeatherInfo(data)
}
catch(e){
    loadingScreen.classList.remove("active")
alert("Enter some existing place")
}
}

function renderWeatherInfo(weatherInfo){
//firstly we have to fetch the elements
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");


//fetch value from weather 
cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        
        alert("no geolocation found")
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
 
const grantAcessButton=document.querySelector("[data-grantAccess]")
grantAcessButton.addEventListener("click",getLocation)

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        alert("no response")
    }
}