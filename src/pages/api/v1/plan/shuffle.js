const MealPlanner = require('../../../../backend/controllers/plan');

export default async function handler(req, res) {
    const { method, query } = req;

    // Basic Validation
    // TODO: Make this more robust using a schema
    if (query?.location === undefined || isNaN(query?.location)) {
        return res.status(400).end('Bad Request');
    }

    switch (method) {
        case "GET":
            try {
                let result = await MealPlanner.shuffle(query.location, query.id, query.type);
                return res.status(200).json(result);
            } catch (error) {
                console.log(error);
                return res.status(500).end('Internal Server Error');
            }
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}