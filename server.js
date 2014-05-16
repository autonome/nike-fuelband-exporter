var request = require('request'),
    token = process.env.NIKE_ACCESS_TOKEN,
    experienceType = 'FUELBAND',
    baseURL = 'https://api.nike.com',
    basePath = '/me/sport/activities/FUELBAND',
    urlParams = '?access_token={access_token}&experienceType=FUELBAND',
    url = baseURL + basePath + urlParams.replace('{access_token}', token),
    options = {
      url: url,
      headers: {
        'Accept': 'application/json'      
      }
    },
    fb = require('firebase'),
    rootRef = new fb('https://yourfirebasename.firebaseio.com/fuelband');
    
/*

Each API call result is an array of activities that correspond to a single day
of Fuelband usage. 

[ { activityId: 'f3c9fab7-1474-4ac4-becb-80d5dfdfb093',
    activityType: 'ALL_DAY',
    startTime: '2014-01-14T08:00:00Z',
    activityTimeZone: 'America/Los_Angeles',
    status: 'IN_PROGRESS',
    deviceType: 'FUELBAND',
    metricSummary: 
     { calories: 563,
       fuel: 2202,
       distance: 5.538571834564209,
       steps: 7034,
       duration: '7:57:00.000' },
    tags: [],
    metrics: [] }
]
*/

function activityToCSV(activity) {
  console.log(activity)
}

function onNextPage(data) {
  // TODO: do something with result
  console.log('results', data.data)
  data.data.forEach(function(entry) {
    rootRef.push(entry)
  })
  
  // queue up next page request
  if (data.paging.next) {
    setTimeout(function() {
      nextPage(baseURL + data.paging.next, onNextPage);
    }, 5000)
  }
}

function nextPage(url, callback) {
  console.log('requesting', url)
  options.url = url;
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
    else {
      console.log(error)
    }
  })
}

nextPage(url, onNextPage)