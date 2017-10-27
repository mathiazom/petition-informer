var full_response_visible = false;

window.onload = function(){
  // RETRIEVE PETITION FROM URL
  var variable = "p"
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for(var i=0;i<vars.length;i++){
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      if(pair[1] == ""){
        window.location.href = "index.html";
      }
      var purl = "https://petition.parliament.uk/petitions/" + pair[1] + ".json";
    }else{
      window.location.href = "index.html";
    }
  }

  loadPetition(purl);
  setInterval(function(){
     loadPetition(purl);
  },10000);

  var go_back_button = document.getElementById('go_back_title')
  go_back_button.onclick = function(){
    window.location.href = "index.html";
  }
}

function loadPetition(url){
  var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4){
          if(xmlHttp.status == 200){
            PetitionDataReceived(xmlHttp.responseText);
          }else if(xmlHttp.status == 0){
            window.location.href = "index.html";
          }
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function PetitionDataReceived(responseText){

  json = JSON.parse(responseText);

  displayLastRefresh();

  var mainCont = document.getElementById('main_petition_cont');

  // GET SIGNED COUNT
  var total_count = json.data.attributes.signature_count;
  document.getElementById("counter").innerHTML = total_count;

  // CHECK IF RESPONDED TO
  var govResponded = json.data.attributes.government_response != null;
  mainCont.innerHTML = "";

  // TITLE
  var petition_title = document.getElementById('petition_title');
  petition_title.innerHTML = json.data.attributes.action;

  // GO TO TOP BUTTON
  var go_to_page_top = document.getElementById('go_to_page_top');

  if(govResponded){
    mainCont.style.background = "#009624"
    go_to_page_top.src = "ico/ic_expand_less_green_24px.svg";
    go_to_page_top.style.color = "#009624";

    // STATUS
    var status = document.createElement("p");
    status.className = "container";
    status.innerHTML = "<b>Status:</b> Government has responded!";
    mainCont.appendChild(status);

    // SUMMARY
    var response_summary = document.createElement("p");
    response_summary.id = "response_summary";
    response_summary.className = "container";
    response_summary.innerHTML = "<b>Summary of response:</b> <br/><br/>" + json.data.attributes.government_response.summary + "<br/><br/> <button id=show_full_response onclick=showFullResponse()><b>Show full</b></button>";
    mainCont.appendChild(response_summary);

    // DETAILS
    var response_details = document.createElement("p");
    response_details.style.display = "none";
    response_details.className = "container";
    response_details.innerHTML = "<b>Response in full: </b> <br/><br/>" + json.data.attributes.government_response.details;
    mainCont.appendChild(response_details);

    // SHOW FULL RESPONSE
    var show_full_response = document.getElementById('show_full_response');
    if(full_response_visible){
      show_full_response.innerHTML = "Hide full";
      response_details.style.display = "block";
      full_response_visible = true;
    }
    show_full_response.onclick = function(){
        if(response_details.style.display == "block"){
          show_full_response.innerHTML = "Show full";
          response_details.style.display = "none";
          full_response_visible = false;
        }else{
          show_full_response.innerHTML = "Hide full";
          response_details.style.display = "block";
          full_response_visible = true;
        }
    }
  }
  else{
    mainCont.style.background = "#ba000d"
    go_to_page_top.src = "ico/ic_expand_less_red_24px.svg";
    go_to_page_top.style.color = "#ba000d";

    var responded_or_not = document.createElement("p");
    responded_or_not.className = "container";
    responded_or_not.innerHTML = "<b>Status:</b> Government has <ins>not</ins> responded yet";
    mainCont.appendChild(responded_or_not);

  }

  // BACKGROUND
  var background = document.createElement("p");
  background.className = "container";
  background.innerHTML = "<b>Background: </b><br/><br/>" + json.data.attributes.background;
  mainCont.appendChild(background);

  // DETAILS
  var details = document.createElement("p");
  details.className = "container";
  details.innerHTML = "<b>Additional details: </b><br/><br/>" + json.data.attributes.additional_details;
  mainCont.appendChild(details);

  // SIGNATURES BY COUNTRY TABLE
  var signatures_by_country_table = document.createElement("table");
  signatures_by_country_table.className = "container";
  signatures_by_country_table.id = "c_table";

    // ROW HEADERS
    var signatures_by_country_header = document.createElement("tr");
    signatures_by_country_header.innerHTML =
    "<td class=c_data_cell><b>Country</b></td>" +
    "<td class=c_data_cell><b>Signatures</b></td>";
    signatures_by_country_table.appendChild(signatures_by_country_header);

    // LIST SORTED BY SIGNATURE COUNT
    var signatures_by_country_list = json.data.attributes.signatures_by_country;
    signatures_by_country_list.sort(function(a,b){
      return b.signature_count - a.signature_count;
    });

    // COUNTRY ROWS
    for(var c = 0;c<signatures_by_country_list.length;c++){
      var country = signatures_by_country_list[c];

      // COUNTRY ROW
      var c_row = document.createElement("tr");
      if(c%2 == 0){
        c_row.style.background = "#ddd";
      }

      // PROGRESS BAR
      var prog = document.createElement("progress");
      prog.style.width = "100%";
      prog.max = 100;
      var val = (country.signature_count/total_count)*100;
      prog.value = val;

      // COUNTRY NAME CELL
      var c_name_td = document.createElement("td");
      c_name_td.className = "c_data_cell";
      var id = "red";
      if(govResponded){
        id = "green";
      }
      c_name_td.innerHTML = (c+1) + ". " + country.name + " (" + country.code + ")<br/>";
      c_row.appendChild(c_name_td);

      // COUNTRY SIGNATURES CELL
      var c_count_td = document.createElement("td");
      c_count_td.className = "c_data_cell";
      var percent = Number(Math.round(val+'e2')+'e-2');
      if(percent < 0.01){
        percent = "< 0.01";
      }
      c_count_td.innerHTML = country.signature_count + " (" + percent + "%)";

      c_row.appendChild(c_count_td);

      var prog = document.createElement("progress");
      prog.id = id + "_prog";
      prog.max = 100;
      prog.value = val;
      prog.style.width = "100%";

      var prog_tr = document.createElement("tr");
      var prog_td = document.createElement("td");
      prog_td.colSpan = 2;
      prog_td.style.padding = "0";
      prog_td.appendChild(prog);
      prog_tr.appendChild(prog_td);

      // ADD ROW TO TABLE
      signatures_by_country_table.appendChild(c_row);
      signatures_by_country_table.appendChild(prog_td);
    }

  // INSERT TABLE
  mainCont.appendChild(signatures_by_country_table);

  document.getElementById('loading').style.display = "none";
  document.getElementById('main_div').style.display = "block";


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

window.onscroll = function(){
    var elem = document.getElementById("single_petition");
    var go_to_page_top = document.getElementById('go_to_page_top');

    var isMobile = window.innerWidth < 800;

    if(window.pageYOffset > elem.offsetTop){

      var go_to_page_top = document.getElementById('go_to_page_top');

      go_to_page_top.style.display = "block";

      var footer = document.getElementsByTagName('footer')[0];

      var pageUpRect = go_to_page_top.getBoundingClientRect();

      go_to_page_top.onclick = function(){
        // ANIMATION
        var a = window.pageYOffset;
        setInterval(function(){
          if(a > 0){
            if(a > 100){
              a-=(a/100+100);
            }else{
              a-=100;
            }

            window.scrollTo(0,a);
          }else{
          }
        },0);
      };

    }else if(isMobile){
      go_to_page_top.style.display = "none";
    }
    else{
      go_to_page_top.style.display = "none";
    }
}
