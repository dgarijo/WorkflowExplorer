var endpoint;
var endpoints = [
    "http://seagull.isi.edu:3030/ds/", 
    "http://disk.isi.edu:3030/ds/"
]

function endpointonclick(event)  {
    var me = event.target;
    localStorage.setItem("endpoint", me.innerHTML);
    location.reload(true);
}
function readEndpoint() {
    /*    $.get(file, function(data) {    
    endpoints = data.split(/\r?\n/);    */
    for(var i=0;i<endpoints.length;++i)
    {
        var a = '<a href="#" class="endpointurl" onclick="endpointonclick.call(this,event)">' + endpoints[i] + '</a>';
        document.getElementById("dropdown-content").innerHTML += a;        
    }
    if(localStorage.getItem("endpoint")!=null) endpoint = localStorage.getItem("endpoint");
    else {
        endpoint = endpoints[0];
        localStorage.setItem("endpoint", endpoint);
    }
}


readEndpoint();
document.getElementById("chosenendpoint").innerHTML += localStorage.getItem("endpoint");
