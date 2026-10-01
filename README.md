This is a log book app to track the reps, sets, and weight of your lifts each session.

Using the MERN stack
- MongoDB for the database to track past lifts, weights, reps, sets
- Express.js to handle the HTTPS requests, API endpoints, and middleware
- React for the front end using components for the UI elements
- Node.js acted as the runtime environment executing the javascript code

Clerk was used for user auth and session management, by using the user_id given by clerk when using their login I could filter by user_id to ensure data security between users.

Vercel was used to deploy and host the web app while also acting as a continual deployment connected to GitHub to match the commits.
