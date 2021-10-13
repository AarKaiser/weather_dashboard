let apiKey = "d1a4d86df6589c8a7ca0a970d8896508";
let baseURL2 =
  "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=metric&appid=" +
  apiKey;
let fetchButton = $("#fetch-button");
let savedCity = $("#saved-cities");
let contentTop = $("#content-top");
let contentBot = $("#content-bottom");
let redirectURL = "index.html";
let today = moment();
let date = today.format("dddd, MMMM Do, YYYY");
let searchArray = JSON.parse(localStorage.getItem("sArray")) || [];

// Getting City
fetchButton.on("click", function (event) {
  event.preventDefault();
  city = $("#userInput").val();

  console.log(city);
  city = city.toUpperCase();
  processCity(city);
});

// Processes the city using first API

function processCity(city) {
  current =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    apiKey;
  // console.log(current);

  fetch(current)
    .then(function (response) {
      if (response.status != 200) {
        console.log("Incorrect City");
        alert("Please enter a correct city name.");
        document.location.replace(redirectURL);
      } else return response.json();
    })
    .then(function (data) {
      // console.log(Object.keys(data.main))
      // console.log(Object.values(data.main))
      // console.log(Object.keys(data.main).length)
      searchArray.push(city);
      localStorage.setItem("sArray", JSON.stringify(searchArray));
      console.log("Fetch Response 1:");
      console.log(data);
      console.log(data.cod);
      let iconEl =
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      $("#mainRow").css("border", "2px solid black");
      $("#city-date").text(`${city} (${date})`);
      $("#icon").empty();
      $("#icon").append($("<img>").attr("src", iconEl));
      $("#weather-data").empty();
      $("#weather-data").css("style", "list-style: none;");
      $("#weather-data").append(`<li>Temperature: ${data.main.temp}°C</li>`);
      $("#weather-data").append(`<li>Wind: ${data.wind.speed} KM/H</li>`);
      $("#weather-data").append(`<li>Humidity: ${data.main.humidity}%</li>`);
      forecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${apiKey}`;

      // Processing remaining forecast using second API.

      fetch(forecast)
        .then(function (response) {
          if (response.status != 200) {
            document.location.replace(redirectURL);
          } else return response.json();
        })
        .then(function (data) {
          console.log("Fetch Response 2:");
          console.log(data);

          //Setting condition for UV background color.

          if (data.current.uvi >= 0 && data.current.uvi <= 2) {
            $("#weather-data").append(
              `<li class="bg-success">UV Index: ${data.current.uvi}%</li>`
            );
            // console.log(searchArray);
          } else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
            $("#weather-data").append(
              `<li class="bg-warning">UV Index: ${data.current.uvi}%</li>`
            );
          } else if (data.current.uvi >= 6 && data.current.uvi <= 7) {
            $("#weather-data").append(
              `<li class="bg-warning">UV Index: ${data.current.uvi}%</li>`
            );
          } else {
            $("#weather-data").append(
              `<li class="bg-danger">UV Index: ${data.current.uvi}%</li>`
            );
          }
          processForecast(data);
        });
    });
  savedCities();
}

function processForecast(data) {
  console.log("forecast");
  // $("#forecast").text("5 Day Forecast:")
  $("#forecast").empty();
  let newH = $("<h2>").text("5 Day Forecast:");
  $("#forecast").append(newH);

  let newCardContainerEl = $("<div>")
    .attr("id", "cardContainer")
    .attr("class", "row");
  let iconFEl =
    "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
  for (i = 1; i <= 5; i++) {
    console.log(data.daily[i]);
    let newCard = $("<div>").attr("class", "col bg-secondary");
    let pCard5 = $("<p>").text(`${today.format("ddd-mm-yy")}`);
    let pCard = $("<p>").text(`Temp: ${data.daily[i].temp.day}°C`);
    let pCard2 = $("<p>").text(`Wind Speed: ${data.daily[i].wind_speed}KM/H`);
    let pCard3 = $("<p>").text(`Humidity: ${data.daily[i].humidity}%`);
    let pCard4 = $("<img>").attr("src", iconFEl);
    newCard.append(pCard5);
    newCard.append(pCard4);
    newCard.append(pCard);
    newCard.append(pCard2);
    newCard.append(pCard3);
    newCardContainerEl.append(newCard);
  }
  $("#forecast").append(newCardContainerEl);
}

// Generates saved searches
function savedCities() {
  $("#saved-cities").text("");
  for (i = 0; i < searchArray.length; i++) {
    console.log(searchArray[i]);
    $("#saved-cities").append(
      `<button class="bg-info saved-city">${searchArray[i]}</button><br>`
    );
  }
}

// Allow saved searches to trigger search.
savedCity.on("click", function (event) {
  event.preventDefault();
  city = event.target.innerText;
  processCity(city);
  //   processForecast();
});

savedCities();


// I really struggled with this assignment. Still can't figure out how to iterate through the dates. It works, though.