//import functions to test
const {filterSkillsByCategory, calculateTotalCost, matchSkillsToUser} = require('../skillswap-functions');

//example skills array to test with
const skills = [
  { title: 'Python Tutoring', category: 'Programming', price: 20 },
  { title: 'Guitar Lessons', category: 'Music', price: 15 },
  { title: 'Resume Review', category: 'Career', price: 0 },
  { title: 'Web Development', category: 'Programming', price: 25 }
];

//test suite for filterSkillsByCategory function
describe('filter skills by category', () => {
    test('filters skills by category', () => {
        expect(filterSkillsByCategory(skills, 'Programming')).toEqual([{ title: 'Python Tutoring', category: 'Programming', price: 20 },
                                                                       { title: 'Web Development', category: 'Programming', price: 25 }]);
    });
    test('handles "all" category', () => {
        expect(filterSkillsByCategory(skills, 'All')).toEqual([{ title: 'Python Tutoring', category: 'Programming', price: 20 },
                                                               { title: 'Guitar Lessons', category: 'Music', price: 15 },
                                                               { title: 'Resume Review', category: 'Career', price: 0 },
                                                               { title: 'Web Development', category: 'Programming', price: 25 }]);
    });
    test('checks for an empty array when no matches', () => {
        expect(filterSkillsByCategory(skills, 'Cooking')).toEqual([]);
    });
});

//test suite for calculateTotalCost function
describe('calculate total cost', () => {
    test('returns the correct values for different hours and rates', () => {
        expect(calculateTotalCost(20, 2)).toBe(40);
    });
    test('handles free sessions (0 price) and zero hours', () => {
        expect(calculateTotalCost(0,3)).toBe(0);
        expect(calculateTotalCost(20,0)).toBe(0);
    });
    test('returns correct value for decimal hours', () => {
        expect(calculateTotalCost(25, 1.5)).toBe(37.5);
    });
});

//test suite for matchSkillsToUser function
describe('match skills to user', () => {
    test('matches by category and price', () => {
        const user1Needs = { category: 'Programming', maxPrice: 30 };
        expect(matchSkillsToUser(user1Needs, skills)).toEqual([{ title: 'Python Tutoring', category: 'Programming', price: 20 }, 
                                                               { title: 'Web Development', category: 'Programming', price: 25 }]);
    });
    test('filters by max price', () => {
        const user2Needs = { category: 'Programming', maxPrice: 20 };
        expect(matchSkillsToUser(user2Needs, skills)).toEqual([{ title: 'Python Tutoring', category: 'Programming', price: 20 }]);
    });
    test('returns empty array for no matches', () => {
        const user3Needs = { category: 'Cooking', maxPrice: 100 };
        expect(matchSkillsToUser(user3Needs, skills)).toEqual([]);
    });
    test(' includes free skills', () => {
        const user4Needs = { category: 'Career', maxPrice: 0 };
        expect(matchSkillsToUser(user4Needs, skills)).toEqual([{ title: 'Resume Review', category: 'Career', price: 0 }]); 
    });
});