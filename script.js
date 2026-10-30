//button to toggle the skill details section
document.querySelectorAll(".skill-details-toggle").forEach((button) => {
	button.addEventListener("click", () => {
		const card = button.closest(".skill-card");
		const details = card.querySelector(".skill-details");
		const isOpening = details.hidden;

		details.hidden = !isOpening;
		button.textContent = isOpening ? "Hide session details" : "Show session details";
		card.classList.toggle("is-expanded", isOpening);
	});
});

//picking out skill cards and creating an array with their category and column - AI
const skillCards = Array.from(document.querySelectorAll(".skill-card")).map((card) => {
	const categoryText = card.querySelector(".skill-category").textContent;
	const priceText = card.querySelector(".skill-price").textContent;

	return {
		//AI to parse category and price from the skill cards
		category: categoryText.replace("Category:", "").trim(),
		price: priceText.toLowerCase().includes("free")
			? 0
			: Number(priceText.replace(/[^0-9.]/g, "")),
		column: card.closest(".col"),
	};
});

//variable to hold the buttons for filtering skills by category
const filterButtons = document.querySelectorAll(".filter-btn");

//actual filtering of skills by category when a button is clicked - AI
filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const category = button.dataset.category;
		const matchingSkills = new Set(filterSkillsByCategory(skillCards, category));

		skillCards.forEach((skill) => {
			skill.column.hidden = !matchingSkills.has(skill);
		});

		filterButtons.forEach((filterButton) => {
			const isActive = filterButton === button;
			filterButton.classList.toggle("active", isActive);
		});
	});
});

//calculate total cost based on hours and rate inputs and button click
const rateInput = document.getElementById("hourly-rate");
const hoursInput = document.getElementById("hours");
const calculateButton = document.getElementById("calculate-cost");
const resultDisplay = document.getElementById("total-cost");

calculateButton.addEventListener("click", () => {
	const hourlyRate = parseFloat(rateInput.value);
	const hours = parseFloat(hoursInput.value);
	const totalCost = calculateTotalCost(hourlyRate, hours);
	resultDisplay.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
});

//find matching skill cards based on user input for category and max price
const categoryInput = document.getElementById("category-preference");
const maxPriceInput = document.getElementById("max-price");
const findMatchButton = document.getElementById("find-match-btn");

findMatchButton.addEventListener("click", () => {
	const categoryPreference = categoryInput.value;
	const maxPrice = parseFloat(maxPriceInput.value);
	const userNeeds = {category: categoryPreference, maxPrice: maxPrice};
	const matchedSkills = new Set(matchSkillsToUser(userNeeds, skillCards));

	skillCards.forEach((skill) => {
		skill.column.hidden = !matchedSkills.has(skill);
	});
});