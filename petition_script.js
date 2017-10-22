init();

function init(){
  var purl = retrieveQueryURL("p");
  if(purl == ""){
    purl = "202305";
  }
  loadPetition("https://petition.parliament.uk/petitions/" + purl + ".json");
}

function retrieveQueryURL(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for(var i=0;i<vars.length;i++){
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
    return false;
  }
  console.log(query);
}

function loadPetition(url){

  var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            PetitionDataReceived(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function PetitionDataReceived(responseText){

  json = JSON.parse(responseText);

  displayLastRefresh();

  //document.getElementById('all_petitions_list_cont').style.display = "none";

  //document.getElementById('single_petition').style.display = "block";

  // CHECK IF RESPONDED TO
  var govResponded = json.data.attributes.government_response != null;
  document.getElementById('response_txt_cont').innerHTML = "";

  var petition_title = document.getElementById('response_msg');
  document.getElementById('response_msg').innerHTML = json.data.attributes.action;

  if(govResponded){
    document.body.style.background = "#009624"

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
