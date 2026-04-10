import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { workout, date } = req.query;
        const query = {};

        if (workout) query.workout = workout;
        if (date) query.date = new Date(date);

        const collection = db.collection("lifts");
        const results = await collection.find(query).toArray();

        res.status(200).json(results);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error fetching lifts");
    }
});

router.get("/:id", async (req, res) => {
    try {
        let collection = db.collection("lifts");
        let query = { _id: new ObjectId(req.params.id) };
        let result = await collection.findOne(query);

        if(!result) {
            return res.status(404).send("Not Found");
        }

        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Invalid ID")
    }
});

router.post("/", async (req, res) => {
    try {
        let { name, weight, reps, sets, type, date } = req.body;

        if (!name || !weight || !reps || !sets) {
            return res.status(500).send("Missing required fields")
        }

        const typeProvided = type != null && String(type).trim() !== "";
        let collection = db.collection("lifts");

        let resolvedType;
        if (typeProvided) {
            resolvedType = String(type).trim();
        } else {
            const previous = await collection.findOne(
                { name },
                { sort: { date: -1 }, projection: { type: 1 } }
            );
            resolvedType =
                previous && previous.type ? previous.type : "home";
        }

        let newLift = {
            name,
            weight: Number(weight),
            reps: Number(reps),
            sets: Number(sets),
            type: resolvedType,
            date: date ? new Date(date) : new Date(),
        };

        let result = await collection.insertOne(newLift);

        console.log("Inserted document:", result);

        res.status(201).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error adding lift");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        let query = { _id: new ObjectId(req.params.id) };

        let updates = {
            $set: {}
        };

        if (req.body.name !== undefined) {
            updates.$set.name = req.body.name;
        }
        if (req.body.weight !== undefined) {
            updates.$set.weight = Number(req.body.weight);
        }
        if (req.body.reps !== undefined) {
            updates.$set.reps = Number(req.body.reps);
        }
        if (req.body.sets !== undefined) {
            updates.$set.sets = Number(req.body.sets);
        }
        if (req.body.date !== undefined) {
            updates.$set.date = new Date(req.body.date);
        }
        if (req.body.type !== undefined) {
            updates.$set.type = req.body.type;
        }

        if(Object.keys(updates.$set).length === 0) {
            return res.status(400).send("No fields provided");
        }

        let collection = db.collection("lifts");
        let result = await collection.updateOne(query, updates);

        if(result.matchedCount === 0) {
            return res.status(404).send("Lift not found");
        }

        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error updating lift");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let query = { _id: new ObjectId(req.params.id) };

        let collection = db.collection("lifts");
        let result = await collection.deleteOne(query);

        if(result.deletedCount === 0) {
            return res.status(404).send("Lift not found");
        }

        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error deleting lift")
    }
});

export default router;