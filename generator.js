const addDistrictTypeButton = document.getElementById("add-district-type");
const districtTypeList = document.getElementById("district-type-list");
const districtTypeWarning =
    document.getElementById("district-type-warning");

const districtCountInput =
    document.getElementById("districts");

function updateDistrictTypeWarning() {

    const districtCount = Number(districtCountInput.value);

    const amountInputs =
        document.querySelectorAll(".district-type-amount");

    let assignedDistricts = 0;

    amountInputs.forEach(function (input) {
        assignedDistricts += Number(input.value);
    });

    if (assignedDistricts > districtCount) {

        const extraDistricts = assignedDistricts - districtCount;

        districtTypeWarning.textContent =
            `Warning: You have assigned ${extraDistricts} more district(s) than the settlement contains.`;

    } else {

        districtTypeWarning.textContent = "";

    }

}

addDistrictTypeButton.addEventListener("click", function () {

    const districtTypeRow = document.createElement("div");

    districtTypeRow.innerHTML = `
        <select class="district-type">
            <option value="residential">Residential</option>
            <option value="market">Market</option>
            <option value="crafts">Crafts</option>
            <option value="noble">Noble</option>
            <option value="temple">Temple</option>
            <option value="harbor">Harbor</option>
            <option value="military">Military</option>
            <option value="academic">Academic</option>
            <option value="industrial">Industrial</option>
            <option value="mixed">Mixed</option>
        </select>

        <input
            type="number"
            class="district-type-amount"
            value="1"
            min="1"
        >

        <button type="button" class="remove-district-type">
            Remove
        </button>

        <br><br>
    `;

    districtTypeList.appendChild(districtTypeRow);
    updateDistrictTypeWarning();

    const amountInput =
    districtTypeRow.querySelector(".district-type-amount");

amountInput.addEventListener("input", function () {
    updateDistrictTypeWarning();
});

    const removeButton =
        districtTypeRow.querySelector(".remove-district-type");

   removeButton.addEventListener("click", function () {
    districtTypeRow.remove();
    updateDistrictTypeWarning();
});

});

districtCountInput.addEventListener("input", function () {
    updateDistrictTypeWarning();
});

const addShopButton = document.getElementById("add-shop");
const shopList = document.getElementById("shop-list");

addShopButton.addEventListener("click", function () {

    const shopRow = document.createElement("div");

    shopRow.innerHTML = `
        <select class="shop-type">
            <option value="blacksmith">Blacksmith</option>
            <option value="general-store">General Store</option>
            <option value="bakery">Bakery</option>
            <option value="fletcher">Fletcher</option>
            <option value="alchemist">Alchemist</option>
            <option value="herbalist">Herbalist</option>
            <option value="jeweler">Jeweler</option>
            <option value="tailor">Tailor</option>
        </select>

        <input
            type="number"
            class="shop-amount"
            value="1"
            min="1"
        >

        <button type="button" class="remove-shop">
            Remove
        </button>

        <br><br>
    `;

    shopList.appendChild(shopRow);

    const removeButton = shopRow.querySelector(".remove-shop");

    removeButton.addEventListener("click", function () {
        shopRow.remove();
    });

});
const generateButton = document.getElementById("generate-settlement");
const settlementOutput = document.getElementById("settlement-output");

generateButton.addEventListener("click", function () {

    // Basic settlement information
    const population = Number(document.getElementById("population").value);
    const density = document.getElementById("density").value;
    const districtCount = Number(document.getElementById("districts").value);
    const sprawl = document.getElementById("sprawl").value;

    // Fortifications
    const fortificationType = document.getElementById("fortification").value;
    const gates = Number(document.getElementById("gates").value);
    const towers = document.getElementById("towers").checked;
    const moat = document.getElementById("moat").checked;

    // Geography
    const geography = [];

    if (document.getElementById("river").checked) {
        geography.push("River");
    }

    if (document.getElementById("lake").checked) {
        geography.push("Lake");
    }

    if (document.getElementById("coast").checked) {
        geography.push("Coast");
    }

    if (document.getElementById("hills").checked) {
        geography.push("Hills");
    }

    if (document.getElementById("forest").checked) {
        geography.push("Forest");
    }

    if (document.getElementById("cliffs").checked) {
        geography.push("Cliffs");
    }

    if (document.getElementById("island").checked) {
        geography.push("Island");
    }

    // Inns and taverns
    const inns = Number(document.getElementById("inns").value);
    const taverns = Number(document.getElementById("taverns").value);

    // Shops
    const shops = [];

    const shopRows = document.querySelectorAll("#shop-list > div");

    shopRows.forEach(function (row) {

        const type = row.querySelector(".shop-type").value;
        const amount = Number(row.querySelector(".shop-amount").value);

        shops.push({
            type: type,
            amount: amount
        });

    });

// Turn shop quantities into individual locations
const shopLocations = [];

shops.forEach(function (shop) {

    for (let i = 0; i < shop.amount; i++) {

        shopLocations.push({
            type: shop.type,
            district: null
        });

    }

});
// Read the chosen district types
const chosenDistrictTypes = [];

const districtTypeRows =
    document.querySelectorAll("#district-type-list > div");

districtTypeRows.forEach(function (row) {

    const type = row.querySelector(".district-type").value;
    const amount = Number(
        row.querySelector(".district-type-amount").value
    );

    for (let i = 0; i < amount; i++) {
        chosenDistrictTypes.push(type);
    }

});

// Stop if more district types were chosen than districts exist
if (chosenDistrictTypes.length > districtCount) {

    settlementOutput.innerHTML = `
        <p>
            You have assigned ${chosenDistrictTypes.length} district types,
            but the settlement only has ${districtCount} districts.
        </p>
    `;

    return;
}

// Unspecified districts become Residential
while (chosenDistrictTypes.length < districtCount) {
    chosenDistrictTypes.push("residential");
}

// Generate districts
const districts = [];

// Give each district a random population weight
const populationWeights = [];

for (let i = 0; i < districtCount; i++) {

    const randomWeight = 0.5 + Math.random();

    populationWeights.push(randomWeight);

}

// Add all the weights together
const totalWeight = populationWeights.reduce(function (total, weight) {
    return total + weight;
}, 0);

// Keep track of how much population has been assigned
let assignedPopulation = 0;

// Create the districts
for (let i = 0; i < districtCount; i++) {

    let districtPopulation;

    // The final district receives whatever population is left
    if (i === districtCount - 1) {

        districtPopulation = population - assignedPopulation;

    } else {

        districtPopulation = Math.round(
            population * (populationWeights[i] / totalWeight)
        );

        assignedPopulation += districtPopulation;
    }

    districts.push({
    id: i + 1,
    name: `District ${i + 1}`,
    type: chosenDistrictTypes[i],
    population: districtPopulation,
    locations: []
});

}

    // Public spaces
    const parks = Number(document.getElementById("parks").value);
    const squares = Number(document.getElementById("squares").value);

    // Build the settlement object
    const settlement = {
        population: population,
        density: density,
        districtCount: districtCount,
        sprawl: sprawl,
        districts: districts,

        fortifications: {
            type: fortificationType,
            gates: gates,
            towers: towers,
            moat: moat
        },

        geography: geography,

        businesses: {
            inns: inns,
            taverns: taverns,
            shops: shopLocations
        },

        publicSpaces: {
            parks: parks,
            squares: squares
        }
    };

    console.log(settlement);

    settlementOutput.innerHTML = `
    <h2>Settlement Summary</h2>

    <p><strong>Population:</strong> ${settlement.population}</p>
    <p><strong>Density:</strong> ${settlement.density}</p>
    <p><strong>Districts:</strong> ${settlement.districtCount}</p>
    <p><strong>Sprawl:</strong> ${settlement.sprawl}</p>

    <h3>Fortifications</h3>

    <p><strong>Type:</strong> ${settlement.fortifications.type}</p>
    <p><strong>Gates:</strong> ${settlement.fortifications.gates}</p>
    <p><strong>Towers:</strong> ${settlement.fortifications.towers ? "Yes" : "No"}</p>
    <p><strong>Moat:</strong> ${settlement.fortifications.moat ? "Yes" : "No"}</p>

    <h3>Geography</h3>

    <p>
        ${settlement.geography.length > 0
            ? settlement.geography.join(", ")
            : "None"}
    </p>

    <h3>Businesses</h3>

    <p><strong>Inns:</strong> ${settlement.businesses.inns}</p>
    <p><strong>Taverns:</strong> ${settlement.businesses.taverns}</p>
<h4>Shops</h4>

<ul>
    ${settlement.businesses.shops.map(function (shop) {
        return `<li>${shop.type}</li>`;
    }).join("")}
</ul>
    <h3>Public Spaces</h3>

    <p><strong>Parks:</strong> ${settlement.publicSpaces.parks}</p>
    <p><strong>Squares:</strong> ${settlement.publicSpaces.squares}</p>

<h3>Districts</h3>

<p>
    <strong>District Population Total:</strong>
    <span id="district-population-total">${settlement.population}</span>
</p>

<p id="district-population-difference">
    Matches settlement population.
</p>

<button type="button" id="reset-populations">
    Reset Populations
</button>

<br><br>

${settlement.districts.map(function (district) {
    return `
        <div>
            <h4>District ${district.id}</h4>

            <label>
                Name:
                <input
                    type="text"
                    class="district-name"
                    value="${district.name}"
                >
            </label>

            <br><br>

            <label>
                Type:
                <select class="generated-district-type">
                    <option value="residential" ${district.type === "residential" ? "selected" : ""}>Residential</option>
                    <option value="market" ${district.type === "market" ? "selected" : ""}>Market</option>
                    <option value="crafts" ${district.type === "crafts" ? "selected" : ""}>Crafts</option>
                    <option value="noble" ${district.type === "noble" ? "selected" : ""}>Noble</option>
                    <option value="temple" ${district.type === "temple" ? "selected" : ""}>Temple</option>
                    <option value="harbor" ${district.type === "harbor" ? "selected" : ""}>Harbor</option>
                    <option value="military" ${district.type === "military" ? "selected" : ""}>Military</option>
                    <option value="academic" ${district.type === "academic" ? "selected" : ""}>Academic</option>
                    <option value="industrial" ${district.type === "industrial" ? "selected" : ""}>Industrial</option>
                    <option value="mixed" ${district.type === "mixed" ? "selected" : ""}>Mixed</option>
                </select>
            </label>

            <br><br>

            <label>
                Population:
                <input
                    type="number"
                    class="district-population"
                    value="${district.population}"
                    min="0"
                >
            </label>

            <br><br>
        </div>
    `;
}).join("")}

`;

// Remember the originally generated district populations
const originalDistrictPopulations = settlement.districts.map(function (district) {
    return district.population;
});

// District population controls
const populationInputs = document.querySelectorAll(".district-population");
const populationTotal = document.getElementById("district-population-total");
const populationDifference = document.getElementById("district-population-difference");
const resetPopulationsButton = document.getElementById("reset-populations");

function updatePopulationTotal() {

    let total = 0;

    populationInputs.forEach(function (input) {
        total += Number(input.value);
    });

    populationTotal.textContent = total;

    const difference = total - settlement.population;

    if (difference === 0) {

        populationDifference.textContent = "Matches settlement population.";

    } else if (difference > 0) {

        populationDifference.textContent =
            `${difference} above settlement population.`;

    } else {

        populationDifference.textContent =
            `${Math.abs(difference)} below settlement population.`;

    }

}

// Update the total whenever a population is edited
populationInputs.forEach(function (input, index) {

    input.addEventListener("input", function () {

        settlement.districts[index].population = Number(input.value);

        updatePopulationTotal();

    });

});

// Restore the originally generated populations
resetPopulationsButton.addEventListener("click", function () {

    populationInputs.forEach(function (input, index) {

    input.value = originalDistrictPopulations[index];

    settlement.districts[index].population =
        originalDistrictPopulations[index];

});

    updatePopulationTotal();

});

});