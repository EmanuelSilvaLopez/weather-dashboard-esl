var today = dayjs();
var currentDate = (today.format("MM/DD/YYYY"));
var city = "";
var citySearch = $("#city-search");
var citySearchButton = $("#city-search-button");


//Displays weather after clicking search button
citySearchButton.on("click", displayWeather);

//displays weather after running currentWeather function
function displayWeather(event) {
  event.preventDefault();
  if (citySearch.val().trim() !== "") {
    city = citySearch.val().trim();
    currentWeather(city);
  }
}

//gets current weather for searched city and dsiaplys selected information in current weather card
function currentWeather(city) {
  const apiKey = "39b2e9a0fd333be2643292339597d84d";
  var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey + "&units=imperial";

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (weatherData) {

    var weathericon = weatherData.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
    var today = dayjs();
    var city = document.getElementById("current-city");
    city.innerHTML = (weatherData.name + " " + "(" + today.format("MM/DD/YYYY") + ")" + '<img src="' + iconurl + '">');
    
    var windSpeed = document.getElementById("wind-speed");
    windSpeed.textContent = "Wind Speed: " + weatherData.wind.speed + " MPH";
   
    var temp = document.getElementById("temperature");
    temp.textContent = "Temperature: " + weatherData.main.temp + " °F";

    var humidity = document.getElementById("humidity");
    humidity.textContent = "Humidity: " + weatherData.main.humidity + "%";

    // Sets color based on data
    var latCo = weatherData.coord.lat;
    var lonCo = weatherData.coord.lon;
    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?";
    var uvdata = uvQuery + "lat=" + latCo + "&lon=" + lonCo + "&appid=" + apiKey

    $.ajax({
      url: uvdata,
      method: "GET",
    }).then(function (uvIndexData) {
      var uvIndex = document.getElementById("uv-index");
      uvIndex.textContent = "UV Index: " + uvIndexData.value;

      var uvText = uvIndexData.value;
      if (uvText <= 2) {
        uvIndex.setAttribute("class", "badge bg-success");
      }
      else if (uvText <= 6) {
        uvIndex.setAttribute("class", "badge bg-warning");
      }
      else if (uvText > 6) {
        uvIndex.setAttribute("class", "badge bg-danger");
      }
    });

    // Creates cards for 5 day forecast
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/onecall?units=imperial&" + "lat=" + latCo + "&lon=" + lonCo + "&exclude=current,minutely,hourly,alerts" + "&appid=" + apiKey,
      method: "GET",
    }).then(function (forecastData) {
      $("#forecast").empty();

      for (var i = 1; i < 6; i++) {
        var forecastSection = document.getElementById("forecast");

        var unix_timestamp = forecastData.daily[i].dt;
        var date = new Date(unix_timestamp * 1000);
        var forecastDate = dayjs(date).format('MM/DD/YYYY');

        var div1 = document.createElement("div");
        div1.setAttribute("class", "col-sm");
        forecastSection.appendChild(div1);

        var div2 = document.createElement("div");
        div2.setAttribute("class", "card card-body backg border-dark");
        div1.appendChild(div2);

        var ptag1 = document.createElement("p");
        ptag1.textContent = forecastDate;
        div2.appendChild(ptag1);

        var img2 = document.createElement('img');
        img2.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + "@2x.png");
        img2.setAttribute("alt", forecastData.daily[i].weather[0].description);
        div2.appendChild(img2);

        var forecastTemp = forecastData.daily[i].temp.day;
        var ptag2 = document.createElement("p");
        div2.appendChild(ptag2);
        ptag2.textContent = "Temp:" + forecastTemp + "°F";

        var forecastHumidity = forecastData.daily[i].humidity;
        var ptag3 = document.createElement("p");
        div2.appendChild(ptag3);
        ptag3.textContent = "Humidity:" + forecastHumidity + "%";
      }
    })
  });
}; 