document.addEventListener("DOMContentLoaded", start);

const url = `https://spreadsheets.google.com/feeds/list/1w0KfqkwXMfSVEFIfUSZEEWg6rktwej2XLRq3J4lhHFo/od6/public/values?alt=json`;
let retter;
let filter = "alle";

// første funktion der kaldes efter DOM er loaded
function start() {
    const filterKnapper = document.querySelectorAll(".filter");
    filterKnapper.forEach(knap => knap.addEventListener("click", filtreringRetter));

    const sortKnapper = document.querySelectorAll(".sort");

    sortKnapper.forEach(knap => knap.addEventListener("click", sorterRetter)); //gør filtreringsknapper klikbare

    loadData();
}

// funktion der henter data fra Google sheet (via url)
async function loadData() {
    const response = await fetch(url);
    retter = await response.json();
    visRetter();
}

// funktion der filtrerer retter (json)
function filtreringRetter() {
    console.log("filtrering");
    filter = this.dataset.ret; // sæt variabel "filter" til aktuel værdi
    document.querySelector(".valgt").classList.remove("valgt"); // fjern klassen valgt fra aktuel knap
    this.classList.add("valgt") // marker den nyvalgte knap

    document.querySelector("#inddeling").textContent = this.textContent;

    visRetter(); // kald funktionen visRetter igen med nyt filter
}


//funktion som kan sortere indhold:
function sorterRetter() {
    console.log("sorter");

    retter.feed.entry.sort((a, b) => {
        //hvis der er klikket på et knap som har datasettet dato, så sorterer den efter dato med nyeste først
        if (this.dataset.sort == "dato2") {
            return (b.gsx$dato2.$t - a.gsx$dato2.$t);
        }
        //hvis der er klikket på et knap som har datasettet navn, så sorterer den efter navn alfabetisk
        if (this.dataset.sort == "navn") {
            return (a.gsx$navn.$t.localeCompare(b.gsx$navn.$t));
        }
        //hvis der er klikket på et knap som har datasettet forfatter, så sorterer den efter forfatter alfabetisk
        if (this.dataset.sort == "forfatter") {
            return (a.gsx$forfatter.$t.localeCompare(b.gsx$forfatter.$t));
        }
    });

    document.querySelector(".valgt_2 ").textContent = this.textContent;

    visRetter(); //kald funktionen visRetter med ny sortering
}



//funktion der viser retter i liste view
function visRetter() {
    console.log("vis");
    const dest = document.querySelector("#menu-container"); // container til articles med en ret
    const skabelon = document.querySelector("template").content; // select indhold af html skabelon (article)
    dest.textContent = "";

    retter.feed.entry.forEach(ret => { // loop igennem arrayet retter i JSON
        if (ret.gsx$kategori.$t == filter || filter == "alle") { // tjek hvilken kategori opskriften har og sammenlign med filter eller vis alle
            const klon = skabelon.cloneNode(true);
            klon.querySelector(".navn").textContent = ret.gsx$navn.$t;
            klon.querySelector(".forfatter").textContent = ret.gsx$forfatter.$t;

            klon.querySelector(".profil-billede").src = ret.gsx$billede.$t;
            klon.querySelector("img").alt = ret.gsx$navn.$t;
            //                    klon.querySelector(".kort").textContent = ret.gsx$kort.$t;
            klon.querySelector(".tid").textContent = `${ret.gsx$tid.$t}`;
            klon.querySelector(".personer").textContent = `${ret.gsx$personer.$t} Personer`;

            klon.querySelector(".ret").addEventListener("click", () => {

                location.href = `grøntsageriet_singleview.html?id=${ret.gsx$id.$t}`;
            });
            dest.appendChild(klon);
        }
    })
}
