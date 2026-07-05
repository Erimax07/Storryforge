const api = "http://localhost:5124"

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
    let html = `<p>Storyforge is a dynamic Story Engine developed by Erik Matschke wich allows you to create dynamic storys. The unser can choose the paph.</p>`
    document.getElementById("content").innerHTML = html;
}