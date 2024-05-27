import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

type User = {
  name: string;
  password: string;
};

dotenv.config();

const app: Express =  express();
app.use(express.json());
const port = process.env.PORT || 3000;

const users: User[] =[];

app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {name: req.body.name, password: hashedPassword};
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post('/users/login', async (req: Request, res: Response) => {
  const user = users.find(user => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send('Cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success');
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(port, () => {});