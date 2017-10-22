

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
      el.innerHTML = "<b>" + item.attributes.action + "</b><br/> <p style='font-size:14px;margin-bottom:0;'><i> by " + item.attributes.creator_name + "</i></p>";
      el.className = "all_petitions_list_item";
        el.onclick = (function(i){
          return function(){
            //var purl = list[i].links.self;
            var purl = "/PetitionInformer/petition.html?p=" + list[i].id;

            window.location.href = purl;
          }
        })(i);
        if(item.attributes.government_response != null){
           el.style.borderLeft = "5px solid green";
         }else{
           el.style.borderLeft = "5px solid red";
         }
      document.getElementById('all_petitions_list_cont').appendChild(el);
      // var mark = document.createElement("div");
      // mark.style.height = "5px";
      // if(item.attributes.government_response != null){
      //   mark.style.background = "red";
      // }else{
      //   mark.style.background = "green";
      // }
      // document.getElementById('all_petitions_list_cont').appendChild(mark);
    }

  }

  document.getElementById('loading_img').style.display = "none";
  document.getElementById('main_div').style.display = "block";
}

loadAllPetitions();
