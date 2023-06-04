const { matchPassword } = require("../helper/bycrypt");
const { getToken } = require("../helper/jwt");
const { User } = require("../models");

class Player {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username)
        return res.status(400).json({ message: "Username is required" });
      if (!password)
        return res.status(400).json({ message: "Password is required" });

      let user = await User.findOne({
        where: {
          username,
        },
      });
      if (!user)
        return res.status(401).json({ message: "Invalid Username/Password" });

      const isTrue = matchPassword(password, user.password);
      if (!isTrue)
        return res.status(401).json({ message: "Invalid Username/Password" });

      const payload = { id: user.id };
      const access_token = getToken(payload);
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async register(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username)
        return res.status(400).json({ message: "Username is required" });
      if (!password)
        return res.status(400).json({ message: "Password is required" });

      let user = await User.create({ username, password });
      res.status(201).json({ id: user.id, user: user.username });
    } catch (error) {
      if (
        error.name == "SequelizeUniqueConstraintError" ||
        error.name == "SequelizeValidationError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async getUserInfo(req, res, next) {
    try {
      const data = await User.findOne({
        where: {
          id: +req.user.id,
        },
      });
      const { gacha, balls, draw } = data;
      res.status(200).json({ data: { gacha, balls, draw } });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async pokeballUsed(req, res, next) {
    try {
      const data = await User.findOne({
        where: {
          id: +req.user.id,
        },
      });
      const { ballType } = req.body;
      const { balls } = data;
      let newBalls = balls;
      if (newBalls[ballType] < 1)
        throw { runOut: `Your ${ballType} already run out` };
      newBalls[ballType] = newBalls[ballType] - 1;

      await User.update(
        { balls: newBalls },
        {
          where: {
            id: +req.user.id,
          },
        }
      );
      res.status(200).json({ message: `${ballType} decrease` });
    } catch (error) {
      console.log(error);
      if (error.runOut) res.status(500).json({ message: error.runOut });
      else res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getPokeball(req, res, next) {
    try {
      const data = await User.findOne({
        where: {
          id: +req.user.id,
        },
      });
      const { listBall } = req.body;

      const { balls } = data;
      let newBalls = balls;

      for (let i = 0; i < listBall.length; i++) {
        newBalls[listBall[i].ball] =
          newBalls[listBall[i].ball] + listBall[i].increase;
      }

      await User.update(
        { balls: newBalls },
        {
          where: {
            id: +req.user.id,
          },
        }
      );

      res.status(200).json({ message: `pokeball increase success` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async drawIncrease(req, res, next) {
    try {
      const user = await User.findByPk(+req.user.id)

      await User.update(
        { draw: user.draw + (+req.params.amount) },
        {
          where: { id: +req.user.id },
        }
      );

      res.status(200).json({ message: `draw increase success` });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = Player;
