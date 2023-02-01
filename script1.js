function get(url) {
  return new Promise(function (resolve, reject) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url);
    httpRequest.onload = function () {
      if (httpRequest.status === 200) {
        resolve(httpRequest.response);
      } else {
        reject(Error(httpRequest.statusText));
      }
    };
    httpRequest.onerror = function () {
      reject(Error("Network Error"));
    };

    httpRequest.send();
  });
}

function successHandler(data) {
  const dataObj = JSON.parse(data);
  const div = `
          <h2 class="top">
          <img
              src="http://openweathermap.org/img/w/${
                dataObj.weather[0].icon
              }.png"
              alt="${dataObj.weather[0].description}"
              width="50"
              height="50"
          />${dataObj.name}
          </h2>
          <p>
            <span class="tempC">${tempToC(dataObj.main.temp)}&deg;</span> | 
            ${dataObj.weather[0].description}
          </p>
      `;
  return div;
}

function failHandler(status) {
  console.log(status);
}

function tempToC(kelvin) {
  return (kelvin - 273.15).toFixed(0);
}

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "7ea8e959cebbba86bef1edd5c42ee827";
  // const apiKey = "";

  const weatherDiv = document.querySelector("#weather");

  const locations = ["tehran", "mashhad", "mazandaran", "shiraz"];
  const urls = locations.map(function (location) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
  });

  // Update
  // anonymous function is OK
  // The keyword async before a function makes the function return a promise
  // "async and await make promises easier to write"
  (async function () {
    try {
      let responses = [];
      // The keyword await before a function makes the function wait for a promise.
      // Makes JavaScript wait until that promise settles and returns its result.
      // The await keyword can only be used inside an async function.
      responses.push(await get(urls[0]));
      // The function execution “pauses” at this line
      //    and resumes when the promise settles, with result becoming its result.
      responses.push(await get(urls[1]));
      // That doesn’t cost any CPU resources, because the JavaScript engine can do
      //    other jobs in the meantime: execute other scripts, handle events, etc.
      responses.push(await get(urls[2]));
      responses.push(await get(urls[3]));
      let literals = responses.map(function (response) {
        return successHandler(response);
      });
      weatherDiv.innerHTML = `<h1>Weather</h1>${literals.join("")}`;
    } catch (status) {
      failHandler(status);
    } finally {
      weatherDiv.classList.remove("hidden");
    }
  })();
});
