Step 1 — src/server.ts: the application starts
Step 2 — src/app.ts: Express receives and routes the request
Step 3 — src/routes/authRoutes.ts: the login handler executes
Step 4 — src/models/User.ts: understand what MongoDB returns
Step 5 — Back in authRoutes.ts: bcrypt.compare()
Step 6 — getJwtSecret(): retrieve the signing secret
Step 7 — authRoutes.ts: jwt.sign() creates the access token
Step 8 — authRoutes.ts: send the response to React