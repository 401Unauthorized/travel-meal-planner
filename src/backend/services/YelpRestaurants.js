const api = require('api');

class YelpRestaurants {
    #config;
    #service;

    constructor(conf, serv) {
        // Combine default configuration with passed in config
        this.#config = {
            fieldMapper: (businesses) => {
                return businesses.map(x => ({
                    id: x.id,
                    name: x.name,
                    image: x.image_url,
                    link: x.url,
                    ratingCount: x.review_count,
                    rating: x.rating,
                    address: x.location.display_address.join(" ")
                }));
            },
            ...conf
        };

        // Inject service or use Yelp API Service
        this.#service = serv || api('@yelp-developers/v1.0#2hsur2ylbank95o');
        this.#service.auth(this.#config.apiKey);
    }

    async allMeals(location, limit) {
        const toFetch = [this.breakfastLocations(location, limit), this.lunchLocations(location, limit), this.dinnerLocations(location, limit)];
        const res = await Promise.allSettled(toFetch);
        return {
            breakfast: res[0].value,
            lunch: res[1].value,
            dinner: res[2].value
        }
    }

    async breakfastLocations(location, limit) {
        return await this.#performFetch(location, limit, 'pancakes', 'breakfast%26brunch', 'GoodForMeal.breakfast');
    }
    async lunchLocations(location, limit) {
        return await this.#performFetch(location, limit, 'sandwhich%20shops', null, 'GoodForMeal.lunch');
    }
    async dinnerLocations(location, limit) {
        return await this.#performFetch(location, limit, 'fine%26dining', null, 'GoodForMeal.dinner');
    }

    // Perform Fetch
    async #performFetch(location, limit, term, categories, attributes) {
        try {
            let search = {
                location,
                limit,
                sort_by: 'rating',
                price: '2%2C3%2C4'
            };

            if (term !== null) {
                search.term = term;
            }

            if (categories !== null) {
                search.categories = categories;
            }

            if (attributes !== null) {
                search.arrtibutes = attributes;
            }

            let { data } = await this.#service.v3_business_search(search);

            // There are no results, throw error
            if (data.total <= 0) {
                return { data: null, error: new Error("No Results") };
            } else {
                // There are results, process them
                let results = null;
                // Re-structure data via function
                if (this.#config?.fieldMapper !== undefined) {
                    results = this.#config.fieldMapper(data.businesses);
                }
                return { data: results, error: null };
            }
        } catch (e) {
            return { data: null, error: e };
        }
    }
}

module.exports = YelpRestaurants;