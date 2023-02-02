const { getMongoClient } = require('../../models/mongodb');
const YelpRestaurants = require('../../services/YelpRestaurants');
const { dateDifference, chooseAtRandom } = require('../../utility');

class MealPlanner {
    #config;

    constructor(conf) {
        this.#config = {
            restaurantLimit: 10,
            ...conf
        };
    }

    // ---- Core ----
    async createMealPlan(location) {
        let meals = null;
        location = Number(location);

        // If location data is stored and not expired (less than 1 day old)
        const { doc, collection } = await this.#getLocation(location);
        if (doc !== null && dateDifference(doc.lastUpdated, Date.now() < 1)) {
            console.log("Serving Stored Data: ", location);
            return {
                breakfast: chooseAtRandom(doc.breakfast),
                lunch: chooseAtRandom(doc.lunch),
                dinner: chooseAtRandom(doc.dinner)
            }
        }

        // Fetch for location data from API
        meals = await this.#config.fetch?.allMeals(location, this.#config.restaurantLimit);
        if (meals.breakfast.error || meals.lunch.error || meals.dinner.error) {
            throw new AggregateError([
                meals.breakfast.error,
                meals.lunch.error,
                meals.dinner.error
            ], 'Unable to Fetch All Meals');
        }

        // Update DB with the new data for the provided location
        const record = {
            location,
            lastUpdated: Date.now(),
            breakfast: meals.breakfast.data,
            lunch: meals.lunch.data,
            dinner: meals.dinner.data
        }
        await collection.insertOne(record);

        console.log("Serving Fetched Data: ", location);
        return {
            breakfast: chooseAtRandom(record.breakfast),
            lunch: chooseAtRandom(record.lunch),
            dinner: chooseAtRandom(record.dinner)
        }
    }

    async #getLocation(location) {
        location = Number(location);
        let { collection } = await getMongoClient();
        let doc = await collection.findOne({ location });
        return { doc, collection };
    }

    async shuffle(location, restaurantId, mealType) {
        switch (mealType) {
            case 'breakfast':
                return await this.shuffleBreakfast(location, restaurantId);
            case 'lunch':
                return await this.shuffleLunch(location, restaurantId);
            case 'dinner':
                return await this.shuffleDinner(location, restaurantId);
        }
        throw new Error('Requested Meal Type Not Available');
    }

    async shuffleBreakfast(location, currentId) {
        const { doc } = await this.#getLocation(location);
        if (doc !== null) {
            return {
                breakfast: chooseAtRandom(doc.breakfast, currentId)
            }
        }
        throw new Error("Unable to Get Breakfast Data", location);
    }

    async shuffleLunch(location, currentId) {
        const { doc } = await this.#getLocation(location);
        if (doc !== null) {
            return {
                lunch: chooseAtRandom(doc.lunch, currentId)
            }
        }
        throw new Error("Unable to Get Lunch Data", location);
    }

    async shuffleDinner(location, currentId) {
        const { doc } = await this.#getLocation(location);
        if (doc !== null) {
            return {
                dinner: chooseAtRandom(doc.dinner, currentId)
            }
        }
        throw new Error("Unable to Get Dinner Data", location);
    }
}

let api = new YelpRestaurants({
    apiKey: "Bearer " + process.env.YELP_KEY
});

const MealPlan = new MealPlanner({
    fetch: api
});

module.exports = MealPlan;