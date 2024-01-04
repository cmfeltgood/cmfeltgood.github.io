function setup() {
    let todRise;
    let todSet;
    let yesSet;
    let tomRise;

    let d = new Date();
    let day = d.getDate(); //on date exact
    let month = d.getMonth(); //on date - 1
    let year = d.getFullYear();

    let ind = getIndex(day,month,year)
    
    if (year==2023){
        todRise = data2023[ind][2];
        todSet = data2023[ind][3];
        yesSet = data2023[ind-1][3];
        tomRise = data2023[ind+1][2];
    }
    else if (year == 2024){
        todRise = data2024[ind][2];
        todSet = data2024[ind][3];
        yesSet = data2024[ind-1][3];
        tomRise = data2024[ind+1][2];
    }
    else  if (year % 4 != 0){
        todRise = data2025[ind][2];
        todSet = data2025[ind][3];
        yesSet = data2025[ind-1][3];
        tomRise = data2025[ind+1][2];  
    }
    else {
        todRise = data2024[ind][2];
        todSet = data2024[ind][3];
        yesSet = data2024[ind-1][3];
        tomRise = data2024[ind+1][2];
    }

    let daytime = todSet - todRise;
    let nightimeYes = 86400 - (yesSet - todRise);
    let nighttimeTom = 86400 - (todSet-tomRise);

    let rVals = [yesSet,todRise,todSet,tomRise, nightimeYes, daytime, nighttimeTom];

    return rVals;
}

function main() {
    setInterval(tick,10);
}

function tick() {
    let sunTimes = setup();

    let d = new Date();
    let oldT = d.getHours()*3600+d.getMinutes()*60+d.getSeconds()+d.getMilliseconds()*.001;
    let newT

    if (oldT >= sunTimes[1] && oldT <= sunTimes[2]){
        newT = 21600 + 43200*(oldT-sunTimes[1])/sunTimes[5];
    }
    else if (oldT < sunTimes[1]) {
        newT = -21600 + 43200*(86400-sunTimes[0]+oldT)/sunTimes[4];
        if (newT < 0){
            newT += 86400;
        }
    }
    else {
        newT = 64800 + 43200*(oldT-sunTimes[2])/sunTimes[6];
        if (newT >= 86400){
            newT -= 86400;
        }
    }

    let newTStr = sToTStr(newT);
    let oldTStr = sToTStr(oldT);

    document.getElementById("timeval").innerHTML = "Silly Clock Time: " + newTStr[0];
    document.getElementById("timeval").style = newTStr[1];
    document.getElementById("oldtime").innerHTML = "Old Time: " + oldTStr[0];
    document.getElementById("oldtime").style = oldTStr[1];
    document.getElementById("new hours").innerHTML = "Length of Day Hour = "+Math.round((sunTimes[5])/43200 * 60)+" min";
    document.getElementById("new hours").innerHTML += "<br>Length of Night Hour = "+Math.round((sunTimes[6]+sunTimes[4])/86400*60) + " min";
}



function sToTStr(newT) {
    let newH = Math.floor(newT/3600);
    let newM = Math.floor((newT-newH*3600)/60);
    let newS = Math.floor((newT-newH*3600-newM*60));

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

function getIndex(day, month, year){
    let defaultArr = [31,28,31,30,31,30,31,31,30,31,30,31]

    if (year % 4 == 0) {
        if (year % 100 != 0) {
            defaultArr[1] = 29;
        }
        else if (year % 400 == 0) {
            defaultArr[1] = 29;
        }
    }

    let days = 0;
    let ind = 0;
    while (ind < month) {
        days += defaultArr[ind];
        ind += 1;
    }
    days += day;

    return days;
}

function altTime(){
    main();
}