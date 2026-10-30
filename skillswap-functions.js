//filter skills array by category
function filterSkillsByCategory(skills, category) {
    if (category === 'All') {
        return skills;
    }
    return skills.filter(skill => skill.category === category);
}

//calculate total cost based on hourly rate and number of hours requested
function calculateTotalCost(hourlyRate, hours) {
    return hourlyRate * hours;
}

//match skills to user needs based on category and max price
function matchSkillsToUser(userNeeds, skills) {
    return skills.filter(skill => skill.category === userNeeds.category && skill.price <= userNeeds.maxPrice);
}
//AI says this if statement is required?
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {filterSkillsByCategory, calculateTotalCost, matchSkillsToUser};
}