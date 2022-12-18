
function beginScout(){

    let arr = []
    arr.push(parseInt(document.getElementById("pov_entry").value))
    arr.push(parseInt(document.getElementById("t2").value))
    arr.push(parseInt(document.getElementById("t3").value))
    arr.push(parseInt(document.getElementById("t4").value))

    arr = arr.sort(function (a, b){return a-b})

    let form = document.getElementById("hidden");

    let pov = document.createElement("input");
    pov.type = "hidden";
    pov.name = "pov";
    pov.value = document.getElementById("pov_entry").value;

    let teams = document.createElement("input");
    teams.type = "hidden";
    teams.name = "teams";
    teams.value = arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3]


    form.appendChild(pov);
    form.appendChild(teams);

    form.submit();
}