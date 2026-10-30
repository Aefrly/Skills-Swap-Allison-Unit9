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

//Copied from Resource 4
document.addEventListener("DOMContentLoaded", async () => {
	const skillForm = document.getElementById("skill-form");
	skillForm.addEventListener("submit", handleSkillFormSubmit);

	try {
		await loadSkills();
	} catch (error) {
		console.error("Unable to load skills:", error);
		document.getElementById("loading").hidden = true;
		const errorMessage = document.getElementById("error");
		errorMessage.innerHTML = "Unable to load skills. Please try again later.";
		errorMessage.style.display = "block";
	}
});

async function handleSkillFormSubmit(event) {
	event.preventDefault();

	const form = event.currentTarget;
	const formMessage = document.getElementById("skill-form-message");
	const submitButton = form.querySelector('button[type="submit"]');
	const skillData = {
		title: form.elements.title.value.trim(),
		category: form.elements.category.value.trim(),
		price: Number(form.elements.price.value),
		description: form.elements.description.value.trim(),
	};

	formMessage.textContent = "";
	submitButton.disabled = true;

	try {
		await createSkill(skillData);
		form.reset();
		formMessage.textContent = "Skill created successfully.";
	} catch (error) {
		console.error("Unable to create skill:", error);
		formMessage.textContent = "Unable to create skill. Please try again.";
		submitButton.disabled = false;
		return;
	}

	try {
		await loadSkills();
	} catch (error) {
		console.error("Skill was created, but the skills list could not be refreshed:", error);
		formMessage.textContent = "Skill created, but the list could not be refreshed. Reload the page to see it.";
	} finally {
		submitButton.disabled = false;
	}
}

//Created from Copilot
function renderSkills(skills) {
	const container = document.getElementById("skills-container");
	container.replaceChildren();
	skillCards.splice(0, skillCards.length);

	skills.forEach((skill) => {
		const template = document.getElementById("skill-card-template");
		const column = template.content.firstElementChild.cloneNode(true);
		const body = column.querySelector(".card-body");

		const title = document.createElement("h3");
		title.className = "card-title h5";
		title.innerHTML = skill.title;
		body.append(title);

		appendSkillText(body, "card-text", skill.description);

		const category = skill.category;
		appendSkillText(body, "text-muted skill-category", `Category: ${category}`);

		const price = Number(skill.price);
		appendSkillText(body, "skill-price fw-bold mt-auto mb-1", price === 0 ? "Free" : `$${price} / session`);

		appendSkillText(body, "text-muted mb-0", `Provider: ${skill.provider}`);

		container.append(column);
		skillCards.push({ category, price, column });
	});

	document.getElementById("loading").hidden = true;
}

//Created from Copilot
function appendSkillText(parent, className, text) {
	const element = document.createElement("p");
	element.className = className;
	element.innerHTML = text;
	parent.append(element);
}

//Copied from Resource 4 and changed with Copilot
async function loadSkills() {
	const skills = await fetchSkills();
	if (!Array.isArray(skills)) {
		throw new TypeError("The skills API response must be an array.");
	}

	renderSkills(skills);
	return skills;
}
