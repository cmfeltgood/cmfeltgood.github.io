var lat;
var long;
var solstices = [1687359480,1718916600];
var ts0;
var ts1;
var data = {};

var d = new Date();
var tnow = d.getTime()/1000;

const tiltMax = 23.44*Math.PI/180;

const setOffAng = 0.01454;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const paramArr = JSON.parse(params['loc'])
lat = paramArr[0]*Math.PI/180;
long = paramArr[1]*Math.PI/180



function findSolstices(){
    var s0 = solstices[0];
    var s1 = solstices[1];
    var i = 0;
    while (s1<tnow){
        i += 1;
        s0 = solstices[i];
        s1 = solstices[i+1];
    }
    ts0 = s0;
    ts1 = s1;
}




// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(main);
//     } 
//     else { 
//         // document.getElementById("calculations").innerHTML = "Geolocation is not supported by this browser. Using default (Boston sunset data)";
//         // altTime();
//     }
// }




function setLoc(position){
    lat = position.coords.latitude*Math.PI/180;
    long = position.coords.longitude*Math.PI/180;
}




function findRise(t,check=0,acc=.0001){
    const tang = ((t-ts0)/(ts1-ts0))*2*Math.PI;
    const laSun = Math.cos(tang)*tiltMax;
    const cd = (6.24004077 + 0.01720197 * ((t-946684800)/60/60/24))
    const off = -7.659 * Math.sin(cd)+9.863*Math.sin(2*cd+3.5932)
    const loSun = -(off/60/24)*2*Math.PI

    var y = Math.cos(lat)*Math.cos(laSun)*(Math.cos(long+check)*Math.cos(loSun)+Math.sin(long+check)*Math.sin(loSun))+Math.sin(lat)*Math.sin(laSun)

    if (y+setOffAng<acc && y+setOffAng>-1*acc){return check}

    else{return findRise(t,check-y-setOffAng,acc)}
}

function findSet(t,check=0,acc=.0001){
    const tang = ((t-ts0)/(ts1-ts0))*2*Math.PI;
    const laSun = Math.cos(tang)*tiltMax;
    const cd = (6.24004077 + 0.01720197 * ((t-946684800)/60/60/24))
    const off = -7.659 * Math.sin(cd)+9.863*Math.sin(2*cd+3.5932)
    const loSun = -(off/60/24)*2*Math.PI

    var y = Math.cos(lat)*Math.cos(laSun)*(Math.cos(long+check)*Math.cos(loSun)+Math.sin(long+check)*Math.sin(loSun))+Math.sin(lat)*Math.sin(laSun)

    if (y+setOffAng<acc && y+setOffAng>-1*acc){return check}

    else{return findSet(t,check+y+setOffAng,acc)}
}




function unixToString(t){
    const date = new Date(t*1000);
    var h = date.getHours();

    var apm = "AM";

    if (h>12){
        h-=12
        apm = "PM"
    }
    var m = date.getMinutes();
    if (m<10){
        m = "0"+m;
    }
    var s = date.getSeconds();
    if (s<10){
        s = "0"+s;
    }
    return (date.toDateString()+", "+h+":"+m+":"+s+" "+apm);
}

function angToTime(a){
    let s = d.getHours()*60*60 + d.getMinutes()*60+d.getSeconds()+60*d.getTimezoneOffset();
    const noon = 12*60*60;
    const off = noon-s;
    const noonE = tnow + off;
    return a*12/Math.PI*60*60+noonE;
}





function setRiseSet(){
    const out = risesetRecursion()
    rise = out[0];
    set = out[1];

    //debug.innerHTML += "<br>Calculated Sunrise: " + unixToString(rise) + "<br>Calculated Sunset: " + unixToString(set);

    setNewHours();
    //document.getElementById("calculations").innerHTML = "Calculated Sunrise: " + unixToString(rise) + "<br>Calculated Sunset: " + unixToString(set);
}



function setNewHours(){
    var twelvehours = 12*60; //in minutes
    var dayHour;
    var nightHour;
    if (set>rise){
        dayHour = (set-rise)/twelvehours;
        nightHour = 120-dayHour; //the math maths i promise
    }
    else{
        nightHour =(rise-set)/twelvehours;
        dayHour = 120-nightHour;
    }

    //document.getElementById("new hours").innerHTML = "Length of Day Hour = "+dayHour.toFixed(2)+" min";
    //document.getElementById("new hours").innerHTML += "<br>Length of Night Hour = "+nightHour.toFixed(2)+ " min";
}


function risesetRecursion(depth=3,tr=tnow,ts=tnow,curr=1){
    var tempRise = angToTime(findRise(tr));
    var tempSet = angToTime(findSet(ts));


    while (tempRise-tempSet>24*60*60 || tempRise-tempSet< -24*60*60){
        if (tempRise > tempSet){
            tempSet += 24*60*60;
        }
        else{
            tempRise += 24*60*60;
        }
    }


    var done = false;
    while (!done){
        if (tempRise > tnow){
            if (tempSet > tnow){
                if (tempSet > tempRise){
                    tempSet -= 24*60*60;
                }
                else{tempRise -= 24*60*60}
            }
            else{done = true}
        }
        else{
            if (tempSet < tnow){
                if (tempSet < tempRise){
                    tempSet += 24*60*60;
                }
                else{tempRise += 24*60*60} 
            }
            else{done = true}
        }
    }
    if (curr<depth){
        return risesetRecursion(depth,tempRise,tempSet,curr+1);
    }
    else{
        return [tempRise,tempSet];
    }
}




function tick(){
    d = new Date();
    tnow = d.getTime()/1000;
    if (tnow>ts1){
        findSolstices();
    }
    if (tnow>set && tnow > rise){
        setRiseSet();
    }

    var r;
    var hours;
    if (set>rise){
        r = (tnow-rise)/(set-rise);
        hours = r*12+6;
    }
    else{
        r = (tnow-set)/(rise-set);
        hours = r*12+18;
    }

    if (hours>24){
        hours -= 24;
    }
    //debug.innerHTML = hours;

    var sillyTime = hToTStr(hours);
    var oldTime = hToTStr(d.getHours()+d.getMinutes()/60+d.getSeconds()/3600);

    data = {"silly_time":sillyTime[0]};
    document.getElementById("timeval").innerHTML = sillyTime[0];
    // document.getElementById("timeval").style = sillyTime[1];
    // document.getElementById("oldtime").innerHTML = "Old Time: " + oldTime[0];
    // document.getElementById("oldtime").style = oldTime[1];



    

}



function hToTStr(h) {
    let newH = Math.floor(h);
    let newM = Math.floor((h-newH)*60);
    let newS = Math.floor((h-newH-newM/60)*3600);

    let d1 = Math.floor(175*newH/24)
    let d2 = Math.floor(175*newM/120);
    let d3 = Math.floor(175*newS/120);

    if (newM < 10) {newM = "0"+newM;}
    if (newS<10) {newS = "0"+newS;}

    let apm;
    if (newH > 12) {
        newH -= 12;
        apm = "PM";
    }
    else{apm = "AM";}

    let tStr = [newH + ":" + newM + ":" + newS + " " + apm,"background-color: rgb("+d1+","+d2+","+d3+");"];

    return tStr;
}



function main(){
    findSolstices();
    setRiseSet();

    tick();

}


main()