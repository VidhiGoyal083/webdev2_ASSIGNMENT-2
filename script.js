const apiKey = "b0d52e722f0f4030b65133958260603";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const historyDiv = document.getElementById("history");
const logs = document.getElementById("logs");

function log(msg){
logs.innerHTML += msg + "<br>";
console.log(msg);
}

// Load history when page loads
window.onload = () => {
let history = JSON.parse(localStorage.getItem("cities")) || [];
history.forEach(city => addHistory(city));
};

// Search button
searchBtn.addEventListener("click", () => {
searchCity();
});

// Enter key support
cityInput.addEventListener("keypress",(e)=>{
if(e.key === "Enter"){
searchCity();
}
});

function searchCity(){
logs.innerHTML = ""; // clear console logs

const city = cityInput.value.trim();

if(city === ""){
weatherResult.innerHTML = `<p style="color:red">Please enter a city</p>`;
return;
}

getWeather(city);
saveCity(city);
}

async function getWeather(city){

log("1️⃣ Start Fetching Weather");

try{

log("2️⃣ Calling API...");

const response = await fetch(
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
);

log("3️⃣ Response Received");

const data = await response.json();

if(response.status === 404){
throw new Error("City not found");
}

if(response.status === 401){
throw new Error("Invalid API Key");
}

log("4️⃣ Data Parsed");

displayWeather(data);

}catch(error){

weatherResult.innerHTML =
`<p style="color:red">${error.message}</p>`;

log("❌ Error: " + error.message);
}

log("5️⃣ Fetch Complete");

}

function displayWeather(data){

weatherResult.innerHTML = `
<p><b>City:</b> ${data.location.name}</p>
<p><b>Temperature:</b> ${data.current.temp_c} °C</p>
<p><b>Weather:</b> ${data.current.condition.text}</p>
<p><b>Humidity:</b> ${data.current.humidity}%</p>
<p><b>Wind:</b> ${data.current.wind_kph} kph</p>
`;

}
// Save history
function saveCity(city){

let history = JSON.parse(localStorage.getItem("cities")) || [];

if(!history.includes(city)){
history.push(city);
localStorage.setItem("cities",JSON.stringify(history));
addHistory(city);
}

}

// Add city button
function addHistory(city){

const span = document.createElement("span");
span.innerText = city;

span.onclick = () => {
getWeather(city);
};

historyDiv.appendChild(span);

}