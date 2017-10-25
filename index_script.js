window.onscroll = function(){
  isScrolledIntoView(document.getElementById("all_petitions_list_cont"));
}

function isScrolledIntoView(elem)
{
    var header = document.getElementById('header');
    var header_min = document.getElementById('header_min');
    var go_to_page_top = document.getElementById('go_to_page_top');

    if(window.pageYOffset > elem.offsetTop){
      header.style.display="none";
      header_min.style.display="inline-block";

      var go_to_page_top = document.getElementById('go_to_page_top');

      go_to_page_top.style.display = "block";

      var footer = document.getElementsByTagName('footer')[0];

      var pageUpRect = go_to_page_top.getBoundingClientRect();
      var footerRect = footer.getBoundingClientRect();

      if(window.innerHeight > (footerRect.top + window.innerHeight - pageUpRect.bottom)){
        go_to_page_top.style.background = "#eee";
        go_to_page_top.src = "ico/ic_expand_less_blue_24px.svg"
      }else{
        go_to_page_top.style.background = "#0277bd";
        go_to_page_top.src = "ico/ic_expand_less_white_24px.svg"
      }
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

    }else{
      header.style.display="inline-block";
      header_min.style.display="none";
      go_to_page_top.style.display = "none";
    }
}

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
      el.innerHTML = "<b>" + item.attributes.action + "</b><br/> <p class=all_petitions_list_item_p style='margin-bottom:0;'><i> by " + item.attributes.creator_name + "</i></p>";
      el.className = "all_petitions_list_item";
        el.onclick = (function(i){
          return function(){
            //var purl = list[i].links.self;
            var purl = "petition.html?p=" + list[i].id;

            window.location.href = purl;
          }
        })(i);
        if(item.attributes.government_response != null){
           el.style.borderLeft = "5px solid green";
         }else{
           el.style.borderLeft = "5px solid red";
         }
      document.getElementById('all_petitions_list_cont').appendChild(el);
    }

  }

  document.getElementById('loading_img').style.display = "none";
  document.getElementById('main_div').style.display = "block";
}

loadAllPetitions();
