var next_page;
var prev_page;
var page_number =1;

$(document).ready(function(){
    $("#close").on("click",close_result);
    function close_result(){
        $(".popup").hide();
        
    }
    $(document).on('keyup',function(evt) {
        if (evt.keyCode == 27) {
         $(".popup").hide();
        }
    });

        
// Next button;    
$("#next-btn").on("click",onNextClicked);
   
retrieveElmeters("https://elcertificate.etc.se/api/elmeter/")
function onNextClicked(){   
    if(next_page==null){
        return false;
    }   
                  
            
    $(".page").html("Sidan " + ++page_number);
        
           
    retrieveElmeters(next_page);       
}

// Previous button;
$("#pre-btn").on("click",onpreviousClicked);

    function onpreviousClicked(){
        if (prev_page == null ){
            return false;
        }
        if(page_number==0){
            $(".page").html("Sidan " + 1);
        }    
            
        $(".page").html("Sidan " + --page_number);
        
        retrieveElmeters(prev_page);
    }    
})
 var last_request = "";
// Max_capacity, Current_capacity, Proggross bar (none and block), Loading;
function to_the_link(){
    // Loading is on;
    
    $(".popup").show();
   
    $(".progress_bar_wrapper").hide();
    $(".lds-ellipsis").show();    

    // url
    var ip =($(this).attr("url"));
    url = "/api.php?path=" + ip;
    last_request = url;
    $.ajax({
        url:url,
        method:"GET",
        success: function(data){
           if(this.url == last_request){       
            d = JSON.parse(data);
            cap= d.max_capacity;
            curr= d.current_production;
            cap_html=  d.max_capacity + "W";
            curr_html= d.current_production +"W";

                       
            //progress bar;
            var width=(curr/cap)*100;
            if(isNaN(width)){
                $("#pro").html("0%");
                $("#progress_bar").css("width","0%");

            }
            else{
                $("#pro").html(width.toFixed(2) +"%");
                $("#progress_bar").css("width",width+"%");
            }
            $("#rpi_id").html( d.rpi_serial);
            $("#current_production").html(curr_html);
            $("#max_capacity").html(cap_html);
           
            
            //loading is off;
            $(".lds-ellipsis").hide();              
            $(".progress_bar_wrapper").show();
        }
            
           
           
        }
        
    })        
    
}
   

// Url function; 
function retrieveElmeters(endpoint){
    const url = "/api.php?path=" + endpoint;
    $.ajax({
        url:url,
        method:"GET",
        success: function(data){
            d = JSON.parse(data);
            next_page = d.next;
            prev_page = d.previous;   
            console.log(next_page);   
            
            renderItems(d.results); 
        }

    })
}

// render function;
function renderItems(items){
    var span = $("#result");
    
    
    span.empty();
    items.map(function(item){
        div= $(document.createElement("div"));

        div.addClass("card");
        div.attr("url",item.url);
        div.on("click",to_the_link);
        
           
        div.html("<div class='card-body'>" + item.rpi_serial + "</div>");
               
        span.append(div);
        
        

    })         
}

