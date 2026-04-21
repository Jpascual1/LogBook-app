import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { getAuth } from "@clerk/express";

const router = express.Router();

router.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.locals.userId = userId;
    next();
});

router.get("/", async (req, res) => {
    try {
        const { workout, date } = req.query;
        const query = { userId: res.locals.userId };

        if (workout) query.workout = workout;
        if (date) query.date = new Date(date);

        const collection = db.collection("lifts");
        const results = await collection.find(query).toArray();

        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching lifts" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let collection = db.collection("lifts");
        let query = {
            _id: new ObjectId(req.params.id),
            userId: res.locals.userId,
        };
        let result = await collection.findOne(query);

        if (!result) {
            return res.status(404).json({ error: "Not Found" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Invalid ID" });
    }
});

router.post("/", async (req, res) => {
    try {
        let { name, weight, reps, sets, type, date } = req.body;

        const nameOk = typeof name === "string" && name.trim() !== "";
        const w = Number(weight);
        const r = Number(reps);
        const s = Number(sets);
        if (!nameOk || Number.isNaN(w) || Number.isNaN(r) || Number.isNaN(s)) {
            return res.status(400).json({ error: "Missing or invalid fields" });
        }

        const typeProvided = type != null && String(type).trim() !== "";
        let collection = db.collection("lifts");
        const userId = res.locals.userId;

        let resolvedType;
        if (typeProvided) {
            resolvedType = String(type).trim();
        } else {
            const previous = await collection.findOne(
                { name: name.trim(), userId },
                { sort: { date: -1 }, projection: { type: 1 } }
            );
            resolvedType =
                previous && previous.type ? previous.type : "home";
        }

        let newLift = {
            name: name.trim(),
            weight: w,
            reps: r,
            sets: s,
            type: resolvedType,
            userId,
            date: date ? new Date(date) : new Date(),
        };

        let result = await collection.insertOne(newLift);

        console.log("Inserted document:", result);

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error adding lift" });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        let query = {
            _id: new ObjectId(req.params.id),
            userId: res.locals.userId,
        };

        let updates = {
            $set: {},
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

        if (Object.keys(updates.$set).length === 0) {
            return res.status(400).json({ error: "No fields provided" });
        }

        let collection = db.collection("lifts");
        let result = await collection.updateOne(query, updates);

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Lift not found" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating lift" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let query = {
            _id: new ObjectId(req.params.id),
            userId: res.locals.userId,
        };

        let collection = db.collection("lifts");
        let result = await collection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Lift not found" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting lift" });
    }
});

export default router;
