/**
 * Loads facts from json
 */
const loadFactsFromJson = async () => {
  const response = await fetch("assets/js/json/facts.json");
  const res = await response.json();
  facts = res["facts"];
  createFactCards(facts);
};

/**
 * Creates fact cards based on the facts loaded from json
 */
const createFactCards = (facts) => {
  const factsList = document.getElementById("facts-list");
  for (let i = 0; i < facts.length; i++) {
    factsList.innerHTML =
      factsList.innerHTML +
      `<div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                <img src="${facts[i].image}" alt="Image for ${facts[i].name}">
                </div>
                <div class="flip-card-back">
                <p>${facts[i].name}</p>
                <p>${facts[i].fact}</p>
                </div>
            </div>
        </div>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
    loadFactsFromJson();
});