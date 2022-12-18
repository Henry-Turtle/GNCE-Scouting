


window.onload = function(){
    let test = new WebSocket('ws://localhost:8080');
    test.addEventListener('open', function(event){
        document.getElementById("good").innerHTML = "Online";
        document.getElementById("bad").innerHTML = "";
    })
    setTimeout(()=>(test.close()), 500)
    
}

var newPackets = [];
let finished = false;

function syncData(){
    if (finished){
        let queues = document.createElement("input")
        queues.name = "queues"
        queues.value = JSON.stringify(newPackets);

        document.getElementById("secret").append(queues);

        document.getElementById("secret").submit();
        return;
    }
    var server = new WebSocket('ws://localhost:8080');
    showConsole("Uploading " + views.length + " views");

    let numViews = views.length;
    let currentView = 0;

    for (let i = 0; i < numViews; i++){
    }    

    server.addEventListener('open', function(event){
        
        server.send(makePacket(views[currentView]));
        
        
    })

    server.addEventListener('message', function(event){
        let packet = JSON.parse(JSON.parse(JSON.stringify(event.data)))
        showConsole("Sending packet "+(currentView+1));
        
        
        if (packet.aim == "error"){
            showConsole("ERROR: " + packet["error"] + ": " + packet["message"], true)
            showConsole(JSON.stringify(views[currentView]), true);
        } 

        if (packet.aim == "update"){

            let queue = {
                "db": "views",
                "id": views[currentView]["id"],
                "match_id": packet["match_id"]
            }

            queue = JSON.stringify(queue);

            newPackets.push(queue);
            
            showConsole(JSON.stringify(queue));

            if (packet.new_game == true){
                let queue = {
                    "db": "matches",
                    "teams": views[currentView]["teams"],
                    "match_id": packet.match_id
                }

                queue = JSON.stringify(queue);

                newPackets.push(queue);
                showConsole(JSON.stringify(queue));
            }
        }

        currentView++;

        if (currentView < views.length){
            server.send(makePacket(views[currentView]));
            
        }
        else{
            server.close();
            finished = true;
            document.getElementById("sync-button").innerHTML = "Click to Merge"
        }
        

    })

server.addEventListener('close', function(event){
})

}

function makePacket(view){
    str = JSON.stringify(view)

    packet = {
        "aim" : "push",
        "content": {
            "pov": view.pov,
            "teams": view.teams,
            "moves": view.moves,
            "created_at": view.created_at,
            "updated_at": view.updated_at
        }
    }
    console.log(JSON.stringify(packet))
    return JSON.stringify(packet);

}


function showConsole(message, error = false){
    p = document.createElement("p");
    p.innerHTML = message;
    if (error) p.style.color = "#ff4530"
    document.getElementById("console").append(p)
}