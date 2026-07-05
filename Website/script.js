const api = "http://localhost:5124"

let story;
document.addEventListener("DOMContentLoaded", () => {
    loadHome();
});
async function loadData() {
    try {
        const response = await fetch("http://localhost:5124/storyList");
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        let html = '<div class="storyList">';
        data.info.forEach(element => {
            html += 
            `
            <button onclick="loadStory(${element.id})" class="story">
                <span>Title: ${element.title}     Author: ${element.author}</span><br>
                Desctiption: ${element.description}
            </button>
            `
        });
        html += "</div>";
        document.getElementById("content").innerHTML = html;

    } catch (error) {
         document.getElementById("content").innerHTML =
                    "Error: " + error.message;
    }
}

function loadHome() {
    let html = `
    <div class="home">
    <p>Storyforge is a dynamic Story Engine developed by Erik Matschke wich allows you to create dynamic storys. The unser can choose the paph.</p>
    </div>
    `

    document.getElementById("content").innerHTML = html;
}

async function loadStory(id){
     try {
        const response = await fetch(`http://localhost:5124/story/${id}`);
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const element = await response.json();
        story = element;

        let html =  
            `
            <div class="story">
                <p>${element.id}</p>
                <p>${element.title}</p>
                <p>${element.description}</p>
                <p>${element.creation}</p>
                <p>${element.author}</p>
                <p>${element.genre}</p>
                <p>${element.nodes}</p>
            </div>
            `
        document.getElementById("content").innerHTML = html;

    } catch (error) {
         document.getElementById("content").innerHTML =
                    "Error: " + error.message;
    }
}





