
//TODO: Make Options panel dynamically resize to take up additional space on display panel x

//TODO: Circle can behave unexpectedly if multiple nodes are clicked in rapid succession. Engineer a better system for controlling its movement

//TODO: Make a way to input the match number

const circle = document.getElementById("circle");
const central = document.getElementById("central");
const field = document.getElementById("field");
const mode = document.getElementById("mode");

const padding = parseInt(getComputedStyle(document.getElementById("field")).padding);

const smallSize = 15 / 600;
const mediumSize = 18 / 600;
const largeSize = 20 / 600;

let time = Date.now();

let moves = [];
let heights = [0, 0, 0, 0, 0]; //* ground, low, mid, high,, miss



const modes = [
    {
        name: "start", display: "Press to Start", duration: 0, update: () => {document.getElementById("time").innerHTML = currentMode.display}
    },
    {name: "autonomous", display: "Autonomous", duration: 30, update: ()=>{
        document.getElementById("time").innerHTML = currentMode.display + " - " + ((Date.now()-time)/1000).toFixed(1);
        if((Date.now()-time)/1000 > currentMode.duration){nextMode()}

    }},
    {name: "wait", display: "Begin Manual", duration: 0, update: () => {document.getElementById("time").innerHTML = currentMode.display}},
    {name: "manual", display: "Manual", duration: 120, update: ()=>{
        document.getElementById("time").innerHTML = currentMode.display + " - " + ((Date.now() - time)/1000).toFixed(1);
        if((Date.now() - time)/1000 > currentMode.duration){nextMode();}
    }},
    {name: "end", display: "Finish Scout", duration: 0, update: ()=>{document.getElementById("time").innerHTML = currentMode.display}}
]
let currentMode = modes[0]
function nextMode() {currentMode = modes[modes.indexOf(currentMode)+1]}

//*Button logic
var selected = document.getElementById("cone")

function buttonPress(element) {
    selected.classList.remove("selected");
    selected = element;
    selected.classList.add("selected");
}

//*ImageMap

document.getElementById("screen").onclick = function (e) {
    if (circle.classList.contains("animation-lock")) return;
    if (modes.indexOf(currentMode) % 2 == 0) return;

    let biggerSide = (central.offsetHeight > central.offsetWidth) ? central.offsetHeight : central.offsetWidth;
    let smallerSide = (central.offsetHeight > central.offsetWidth) ? central.offsetWidth : central.offsetHeight;


    let size = smallerSide - (padding * 2);
    let offset = (biggerSide - size) / 2

    let width;
    let height;

    if (central.offsetWidth === biggerSide) {
        height = e.clientY - padding - mode.offsetHeight;
        width = e.clientX - offset;

    }

    if (central.offsetHeight === biggerSide) {
        height = e.clientY - offset - mode.offsetHeight;
        width = e.clientX - padding;
    }
    for (let y = 1; y <= 5; y++) {
        for (let x = 1; x <= 5; x++) {
            if (height > ((y / 6) * size) - 20 && height < ((y / 6) * size) + 20 && width > ((x / 6) * size) - 20 && width < ((x / 6) * size) + 20) {
                //*Animate circle
                circle.style.display = "block";
                if (central.offsetWidth == biggerSide) {
                    circle.style.top = padding + ((size * y) / 6) - (circle.clientHeight / 2) + "px";
                    circle.style.left = offset + ((size * x) / 6) - (circle.clientWidth / 2) + "px";
                }
                else {//*incase they are same size
                    circle.style.top = offset + ((size * y) / 6) - 2 + "px";
                    circle.style.left = padding + ((size * x) / 6) - 2 + "px";
                }
                circle.classList.add("cone-pressed");
                circle.classList.add("animation-lock")
                circle.addEventListener("transitionend", () => circle.classList.remove("cone-pressed"));
                setTimeout(() => {
                    circle.style.backgroundColor = "#2eb555";
                    circle.style.top = "0px";
                    circle.style.left = "0px";

                    circle.style.display = "none";
                    circle.classList.remove("animation-lock")
                }, 1000);

                circle.style.display = "block";

                //*Deal with data
                let height
                if (y == 1 || y == 5){

                    if (x == 2 || x == 4){
                        height = "low"
                    }

                    if (x == 1 || x == 3 || x == 5){
                        height = "ground"
                    }

                    
                }
                if (y == 2 || y == 4){
                    if (x == 3){
                        height = "high"
                    }
                    if (x == 2 || x == 4){
                        height = "mid"
                    }
                    if (x == 1 || x == 5){
                        height = "low"
                    }
                }
                if (y == 3){
                    if (x == 1 || x == 3 || x == 5){
                        height = "ground"
                    }
                    if (x == 2 || x == 4){
                        height = "high"
                    }
                }
                let val = selected.value
                if (modes.indexOf(currentMode) == 3){ //* if mode is manual, deal with time delay
                    moves.push(new Action(selected.value, ("" + x + y), height, (((Date.now()-time)/1000) + modes[1].duration).toFixed(2) ));
                }
                else{
                    moves.push(new Action(selected.value, ("" + x + y), height, ((Date.now() - time) / 1000).toFixed(2) ));
                }
                if (selected.value == "miss"){
                    heights[4]++
                    updateCones()
                    return
                }

                switch (height){
                    case "ground":
                        heights[0]++
                        break
                    
                    case "low":
                        heights[1]++
                        break
                    
                    case "mid":
                        heights[2]++
                        break
                    
                    case "high":
                        heights[3]++
                        break

                    
                    default:
                        alert(height)
                }  
                updateCones()

            }
        }
    }



    //alert((e.clientY - offset)/(biggerSide - offset * 2 - 20));


}

function undo(){
    if (moves.length == 0){
        return
    }

    let move = moves.pop()
    
    if (move.coneType == "miss"){
        heights[4]--
        updateCones()
        return
    }
    
    let h = move.height

    

    switch (h){
        case "ground":
            heights[0]--
            break
        
        case "low":
            heights[1]--
            break
        
        case "mid":
            heights[2]--
            break
        
        case "high":
            heights[3]--
            break
        
        default:
            alert(h)
    }
    updateCones()

}

function updateCones(){
    document.getElementById("ground").innerHTML = heights[0]
    document.getElementById("low").innerHTML = heights[1]
    document.getElementById("mid").innerHTML = heights[2]
    document.getElementById("high").innerHTML = heights[3]
    document.getElementById("misses").innerHTML = heights[4]

}

//*Update time
setInterval(updateTime, 50);
function updateTime() {
    currentMode.update();
}

document.getElementById("mode").addEventListener("click", function(){
    if(modes.indexOf(currentMode) == 4){
        submitData();
    }
    if (modes.indexOf(currentMode) == 0){
        time = Date.now();
        nextMode();
        return;
    }
    if (modes.indexOf(currentMode) == 2){
        time = Date.now();
        nextMode();
        return;
    }
})

//* allow hotkeying coneTypes
document.onkeyup = function(e){
    let hotkey
    switch (e.key){
        case "m":
            hotkey = "miss"
            break
        case "c":
            hotkey = "cone"
            break
        case "b":
            hotkey = "beacon"
            break
    }
    selected.classList.remove("selected");
    selected = document.getElementById(hotkey);
    selected.classList.add("selected");
}



//*Submit data to database

function submitData(){
    let form, actions

    form = document.getElementById("form");

    
    actions = document.createElement("input");
    actions.type = "hidden";
    actions.name = "actions";
    actions.value = JSON.stringify(moves);

    form.appendChild(actions);
    
    form.submit();
}


class Match {
    constructor(id, team, moves) {
        this.id = id;
        this.team = team;
        this.moves = moves;
    }

}

class Action {
    constructor(coneType, location, coneHeight, timestamp,) {
        this.coneType = coneType;
        this.location = location;
        this.height = coneHeight
        this.timestamp = timestamp;
    }


}
//@
//!
//todo
//*
//&