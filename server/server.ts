import { createServer } from "node:http";
import { Server } from "socket.io";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

dotenv.config();
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const jwtSecret = process.env.JWT_SECRET || 'Mys3cr3t'

const app = express();
const httpServer = createServer(app);
app.use(cors())
app.use(bodyParser.json());

app.get(
  "/self",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      res.send(req.user);
    } else {
      res.status(401).end();
    }
  },
);

app.post("/login", (req, res) => {
  if (req.body.username === "john" && req.body.password === "changeit") {
    console.log("authentication OK");

    const user = {
      id: 1,
      username: "john",
    };

    const token = jwt.sign(
      {
        data: user,
      },
      jwtSecret,
      {
        issuer: "accounts.examplesoft.com",
        audience: "yoursite.net",
        expiresIn: "1h",
      },
    );

    res.json({ token });
  } else {
    console.log("wrong credentials");
    res.status(401).end();
  }
});

const jwtDecodeOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  issuer: "accounts.examplesoft.com",
  audience: "yoursite.net",
};

passport.use(
  new JwtStrategy(jwtDecodeOptions, (payload, done) => {
    return done(null, payload.data);
  }),
);

const io = new Server(httpServer);

io.engine.use(
  (req: { _query: Record<string, string> }, res: Response, next: Function) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      passport.authenticate("jwt", { session: false })(req, res, next);
    } else {
      next();
    }
  },
);

io.on("connection", (socket) => {
  const req = socket.request as Request & { user: Express.User };

  socket.join(`user:${req.user.id}`);

  socket.on("whoami", (cb) => {
    cb(req.user.username);
  });
});

httpServer.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});