// Helpers
var fs = require("fs")
let arr_lon = [] //Array which stores the longitudes of centers
let arr_lat = [] //Array which stores the latitudes of centres
let arr_dist = []
let childCareObj;

const calcAge = birthday => {
  now = Date.now();
  birthday = new Date(birthday);
  diff = now - birthday.getTime();
  age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
  return age;
}

const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") { dist = dist * 1.609344 }
  if (unit == "N") { dist = dist * 0.8684 }
  return dist
}

fs.readFile("./database/child-care-fin.json", function (err, data) {
  if (err) {
    console.log(err)
  }
  getCoordinatesAndCentres(data, getCloseCentres)
})
fs.readFile("./database/child-care-fin.json", function (err, data) {
  if (err) {
    console.log(err)
  }
  getCoordinatesAndCentres(data)
})

function getCloseCentres() {

  for (let i = 0; i < arr_lon.length; i++) {
    arr_dist.push(distance(43.6598, -79.3886, parseFloat(arr_lat[i]), parseFloat(arr_lon[i])))
  }
  fs.writeFile("./child-care-filter", generateCoordinatesJson(), function (err) {
    if (err) {
      throw err;
    }
  })
}

function getCoordinatesAndCentres(data) {
  var mainObj = JSON.parse(data)
  childCareObj = mainObj.childCare
  var len = mainObj.childCare.length
  let lon = 0;
  let lat = 0;

  for (let i = 0; i < len; i++) {
    lon = childCareObj[i].longitude;
    lat = childCareObj[i].latitude;
    arr_lon.push(lon)
    arr_lat.push(lat)
  }

  getCloseCentres();
}


let generateCoordinatesJson = function () {
  let coordObj = {}
  coordObj.data = []
  let count = 0;
  for (let i = 0; i < arr_dist.length; i++) {
    if (arr_dist[i] < 5) {
      coordObj.data[count] = childCareObj[i]
      count++;
      if (count == 10) {
        break;
      }
    }
  }

  return (JSON.stringify(coordObj))
}

module.exports = {
  calcAge: calcAge,
  getDistance: distance,
  generateCoordinatesJson: generateCoordinatesJson
}


// fs.readFile("../database/child-care.json", function (err, data) {
//   const mainObj = JSON.parse(data);
//   console.log(mainObj);
// })