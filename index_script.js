

function loadAllPetitions(){
  var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            AllPetitionsDataReceived(xmlHttp.responseText);
    }
    var url = "https://petition.parliament.uk/petitions.json";
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

function AllPetitionsDataReceived(responseText){
  var json = JSON.parse(responseText);
  var list = json.data;
  for(i=0;i<list.length;i++){
    var item = list[i];
    if(item.type == "petition"){
      var el = document.createElement("p");
      el.innerHTML = item.attributes.action + " <i> by " + item.attributes.creator_name + "</i>";
      el.className = "all_petitions_list_item";
        el.onclick = (function(i){
          return function(){
            //var purl = list[i].links.self;
            var purl = "/petition.html?p=" + list[i].id;

            window.location.href = purl;

            // loadPetition(purl);
            // setInterval(function(){
            //   loadPetition(purl);
            // },10000);
          }
        })(i);
      document.getElementById('all_petitions_list_cont').appendChild(el);
    }

  }
}

function init(){

  loadAllPetitions();

  // url = prompt("Enter petition url:","https://petition.parliament.uk/petitions/202305");
  //
  // if(url == null){
  //   url = "https://petition.parliament.uk/petitions/202305";
  // }
  //
  // url = url + ".json";
  //
  // loadPetition(url);
  // setInterval(function(){
  //   loadPetition(url);
  // },10000);
}


init();
