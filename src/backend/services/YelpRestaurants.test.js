const YelpRestaurants = require('./YelpRestaurants');

const apiResponse = `
{
    "businesses": [
        {
            "id": "abc123",
            "alias": "the-halal-guys-new-york-2",
            "name": "The Halal Guys",
            "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/MYnXprCKOS0JlpQJRMOR7Q/o.jpg",
            "is_closed": false,
            "url": "https://www.yelp.com",
            "review_count": 10264,
            "categories": [
                {
                    "alias": "foodstands",
                    "title": "Food Stands"
                },
                {
                    "alias": "mideastern",
                    "title": "Middle Eastern"
                },
                {
                    "alias": "halal",
                    "title": "Halal"
                }
            ],
            "rating": 4,
            "coordinates": {
                "latitude": 40.761861,
                "longitude": -73.979306
            },
            "transactions": [
                "pickup",
                "delivery"
            ],
            "price": "$",
            "location": {
                "address1": "W 53rd Street And 6th Ave",
                "address2": null,
                "address3": "",
                "city": "New York",
                "zip_code": "10019",
                "country": "US",
                "state": "NY",
                "display_address": [
                    "W 53rd Street And 6th Ave",
                    "New York, NY 10019"
                ]
            },
            "phone": "+0000000000",
            "display_phone": "(000) 000-0000",
            "distance": 4072.6750319640314
        }
    ],
    "total": 100,
    "region": {
        "center": {
            "longitude": -73.93627166748047,
            "latitude": 40.745164685533226
        }
    }
}
`

test('Mock API Requests', async () => {
    let mockService = {
        auth: (key) => key,
        v3_business_search: (opts) => {
            return {
                data: JSON.parse(apiResponse)
            }
        }
    }
    const yp = new YelpRestaurants({}, mockService);
    const res = await yp.allMeals(10001, 10);

    expect(res.breakfast.data[0]).toMatchObject({
        id: 'abc123',
        name: 'The Halal Guys',
        image: 'https://s3-media1.fl.yelpcdn.com/bphoto/MYnXprCKOS0JlpQJRMOR7Q/o.jpg',
        link: 'https://www.yelp.com',
        ratingCount: 10264,
        rating: 4,
        address: 'W 53rd Street And 6th Ave New York, NY 10019'
    });

    expect(res.breakfast.error).toBe(null);
});

test('Mock API Request - Empty Results', async () => {
    let mockService = {
        auth: (key) => key,
        v3_business_search: (opts) => {
            return {
                data: {
                    total: 0
                }
            }
        }
    }
    const yp = new YelpRestaurants({}, mockService);
    const res = await yp.dinnerLocations(10001, 10);
    expect(res.error).toBeInstanceOf(Error);
});

test('Mock API Request - Config - Custom Field Mapper', async () => {
    let mockService = {
        auth: (key) => key,
        v3_business_search: (opts) => {
            return {
                data: JSON.parse(apiResponse)
            }
        }
    }
    const yp = new YelpRestaurants({
        fieldMapper: (businesses) => {
            return businesses.map(x => ({
                id: true,
            }));
        }
    }, mockService);
    const res = await yp.dinnerLocations(10001, 10);
    expect(res.data[0].id).toBe(true)
    expect(res.error).toBe(null);
});

test('Mock API Request - Catch Error', async () => {
    let mockService = {
        auth: (key) => key,
        v3_business_search: (opts) => {
            throw new Error("Something Broke!")
        }
    }
    const yp = new YelpRestaurants({}, mockService);
    const res = await yp.dinnerLocations(10001, 10);
    expect(res.error).toBeInstanceOf(Error);
});