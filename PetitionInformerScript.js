function loadFromHTTP(url){

  var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            dataReceived(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function dataReceived(responseText){

  json = JSON.parse(responseText);

  console.log(json);

  displayLastRefresh();


  // CHECK IF RESPONDED TO
  var govResponded = json.data.attributes.government_response != null;
  document.getElementById('response_txt_cont').innerHTML = "";

  /* var responded_or_not = document.getElementById('response_msg');


  var petition_title = document.createElement("p");
  petition_title.className = "container";
  petition_title.innerHTML = "<p>Petition title:</p><h3>" + json.data.attributes.action + "</h3>";
  document.getElementById('response_txt_cont').appendChild(petition_title); */

  var petition_title = document.getElementById('response_msg');
  document.getElementById('response_msg').innerHTML = json.data.attributes.action;

  if(govResponded){
    document.body.style.background = "#009624"

    //responded_or_not.innerHTML = "Government has responded!";

    var responded_or_not = document.createElement("p");
    responded_or_not.className = "container";
    responded_or_not.innerHTML = "Status: Government has responded!";
    document.getElementById('response_txt_cont').appendChild(responded_or_not);

    var response_summary = document.createElement("p");
    response_summary.className = "container";
    response_summary.innerHTML = "<b>Summary of response:</b> <br/><br/>" + json.data.attributes.government_response.summary;
    document.getElementById('response_txt_cont').appendChild(response_summary);

    var response_details = document.createElement("p");
    response_details.className = "container";
    response_details.innerHTML = "<b>Response in full: </b> <br/><br/>" + json.data.attributes.government_response.details;
    document.getElementById('response_txt_cont').appendChild(response_details);



  }else{
    document.body.style.background = "#ba000d"

    //responded_or_not.innerHTML = "Government has <ins>not</ins> responded yet";

    var responded_or_not = document.createElement("p");
    responded_or_not.className = "container";
    responded_or_not.innerHTML = "<b>Status:</b> Government has <ins>not</ins> responded yet";
    document.getElementById('response_txt_cont').appendChild(responded_or_not);

    var details = document.createElement("p");
    details.className = "container";
    details.innerHTML = "<b>Additional details: </b>" + json.data.attributes.additional_details;
    document.getElementById('response_txt_cont').appendChild(details);

    var background = document.createElement("p");
    background.className = "container";
    background.innerHTML = "<b>Background: </b>" + json.data.attributes.background;
    document.getElementById('response_txt_cont').appendChild(background);

  }

  // GET SIGNED COUNT
  var signedCount = json.data.attributes.signature_count;

  document.getElementById("counter").innerHTML = signedCount;

  // var view_map_button = document.getElementById("view_map_button");
  // view_map_button.onclick = function(){
  //   showMap();
  // }
}

// function showMap(){
//   document.getElementById("petition_map").style.display = "block";
//   var view_map_button = document.getElementById("view_map_button");
//   view_map_button.innerHTML = "Hide Petition Map";
//   view_map_button.onclick = function(){
//     hideMap();
//   }
// }
//
// function hideMap(){
//   document.getElementById("petition_map").style.display = "none";
//   var view_map_button = document.getElementById("view_map_button");
//   view_map_button.innerHTML = "Show Petition Map";
//   view_map_button.onclick = function(){
//     showMap();
//   }
// }


function displayLastRefresh(){
  var now = new Date();

  var hours = now.getHours().toString();
  if(hours.length < 2){
    hours = "0" + hours;
  }

  var minutes = now.getMinutes().toString();
  if(minutes.length < 2){
    minutes = "0" + minutes;
  }

  var seconds = now.getSeconds().toString();
  if(seconds.length < 2){
    seconds = "0" + seconds;
  }

  document.getElementById('latest_refresh').innerHTML = "Last Refresh: \n" + hours + ":" + minutes + ":" + seconds;
}

function init(){
  url = prompt("Enter petition url:","https://petition.parliament.uk/petitions/202305");

  if(url == null){
    url = "https://petition.parliament.uk/petitions/202305";
  }

  url = url + ".json";

  loadFromHTTP(url);
  setInterval(function(){
    loadFromHTTP(url);
  },10000);
}


init();
