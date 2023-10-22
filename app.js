// Opciones de animales
const wildLife = [
    { name: "conejo", reward: "gold", unit: 50, citizens_required: 1, hunter_seconds: 2 }, //Poco tiempo para no tardar demasiado 
    { name: "ciervo", reward: "food", unit: 75, citizens_required: 2, hunter_seconds: 3 },
];

// Eras disponibles
const ages = [
    { name: "del amaneces", gold_required: 0 },
    { name: "de piedra", gold_required: 300 }
];

// Animales que se pueden cazar
const animal_list = [];

let status_player = {
    age: 0,
    gold: 100,
    max_gold: 500,
    food: 100,
    max_food: 500,
    citizens: 4
};

// Numero aleatorios de 0 a (max-1)
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

// Numero aleatorios de min a (max-1)
const getRandomIntWithMin = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

// Actualiza la pantalla del estado del jugador
const updateStatus = () => {
    document.getElementById("age").innerHTML = "Edad " + ages[status_player.age].name;
    document.getElementById("gold").innerHTML = "Oro: " + status_player.gold;
    document.getElementById("food").innerHTML = "Comida: " + status_player.food;
    document.getElementById("citizens").innerHTML = "Ciudadanos: " + status_player.citizens;
}

// Actualiza la lista, en pantalla, de animañes que se pueden cazar,
const updateHuntingInterface = (end) => {

    let text = "";

    animal_list.forEach((element, index) => {
        if(end){
            text += "<h2>" + element.name + " <button  onclick='hunting(" + index + ")' disabled>Cazar</button></h2> ";
        }else{
            text += "<h2>" + element.name + " <button  onclick='hunting(" + index + ")' >Cazar</button></h2> ";
        }
    });

    document.getElementById("hunting_interface").innerHTML = text;

}

// Eventos que sucede al presionar el boton cazar
const hunting = (index) => {
    
    let message = "";

    let cit = animal_list[index].citizens_required;

    if (status_player.citizens >= cit) {

        let choose = animal_list.splice(index, 1)[0];
        let units = getRandomIntWithMin(1, choose.unit + 1);
        updateHuntingInterface(false);

        status_player.citizens -= cit;
        updateStatus();

        setTimeout(() => {
            message = "";

            
        
            if ((choose.reward == "gold") && (status_player.gold  < status_player.max_gold)) {
                
                status_player.gold += units;
                message += "Cazaste un " + choose.name + " y obtuviste " + units + " de oro.";
            }

            if (choose.reward == "food" && (status_player.food < status_player.max_food)) {
                status_player.food += units;
                message += "Cazaste un " + choose.name + " y obtuviste " + units + " de comida. ";;
            }

            if(status_player.gold > status_player.max_gold){
                status_player.gold = status_player.max_gold;
                message += "Pero el maximo de oro."
            }

            if(status_player.food > status_player.max_food){
                status_player.food = status_player.max_food;
                message += "Pero el maximo de comida."
            }

            status_player.citizens += cit;
            updateStatus();

            document.getElementById("message").innerHTML = message;

        }, choose.hunter_seconds * 1000);

    }else{
        message += "Aldeanos insuficientes"
    }


    document.getElementById("message").innerHTML = message;


}

//Agrega animales a las lista de caceria
const animalsAppear = (end) => {
    let n_animals = getRandomIntWithMin(1, 10);

    for (let i = 0; i < n_animals; i++) {
        let x = getRandomInt(wildLife.length);
        animal_list.push(wildLife[x]);
    }

    updateHuntingInterface(false);
}

//inicia el juego
const startGame = () => {
    updateStatus();
    animalsAppear();
    document.getElementById("message").innerHTML = "Comienza el juego";
}

//Avanza la edad y si se llega al maximo, detiene
const goToAge = () =>{
    let message = "";

    let gold_req = ages[status_player.age + 1].gold_required;
    
    if(status_player.gold >= gold_req){
        status_player.age += 1;
        status_player.gold -= gold_req;
        updateStatus();
        message += "Avenzo a la edad " + ages[status_player.age].name + "."
    }
    else{
        message += "Oro insuficiente"
    }


    if(!(status_player.age < ages.length - 1)){
        message += "Y llego a la edad maxima."
        document.getElementById("future").setAttribute("disabled", "true");
        clearInterval(intervalID);
        updateHuntingInterface(true);
    }

    document.getElementById("message").innerHTML = message;
    
}


// Eventos discretos que pueden pasar
const randomEvent = () => {
    //o: nada
    //1: aparece n animales
    //2: 

    const ap_animals = getRandomInt(3);

    if (ap_animals == 1){
        animalsAppear();
    }
}

//Despues 0 a 5 segundos ocurre algo
var intervalID = setInterval(randomEvent, getRandomInt(5)*1000);

//comienza el juego
const start = setTimeout(startGame, 1000);


