const { default: axios } = require("axios");
const additionalPower = require("../helper/power");
const { Pokemon, User, UserPokemon, Type, TypePokemon } = require("../models");
const { elementWeakness } = require("../helper/element");

class Pokemons {
  static async getMyCollection(req, res, next) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const sort = req.query.sort;
      const limit = 50;
      const offset = (page - 1) * limit;

      const { count, rows } = await UserPokemon.findAndCountAll({
        where: { UserId: +req.user.id },
        include: [
          {
            model: Pokemon,
            attributes: [
              "id",
              "name",
              "hp",
              "attack",
              "def",
              "baseExp",
              "power",
              "img1",
              "img2",
              "summary",
              "frontView",
              "backView",
            ],
            include: [
              {
                model: Type,
                attributes: ["name", "weakness", "strength", "immune"],
                through: { attributes: [] },
              },
            ],
          },
        ],
        order: sort === "true" ? [[{ model: Pokemon }, "power", "DESC"]] : [],
      });

      const distinctPokemonCount = await UserPokemon.count({
        distinct: true,
        col: "PokemonId",
        where: { UserId: +req.user.id },
      });

      const sortedUserPokemonData = rows.sort((a, b) => {
        const powerA = a.Pokemon.power;
        const powerB = b.Pokemon.power;
        if (powerA > powerB) {
          return sort === "true" ? -1 : 1;
        } else {
          return 0;
        }
      });

      const paginatedUserPokemonData = sortedUserPokemonData.slice(
        offset,
        offset + limit
      );

      const userPokemonData = paginatedUserPokemonData.map((userPokemon) => {
        const {
          id,
          name,
          hp,
          attack,
          def,
          baseExp,
          power,
          img1,
          img2,
          summary,
          frontView,
          backView,
        } = userPokemon.Pokemon;

        const types = elementWeakness(userPokemon.Pokemon.Types);
        const level = userPokemon.level - 1;

        return {
          id,
          name,
          hp: hp + Math.floor((5 / 100) * hp) * level,
          attack: attack + Math.floor((5 / 100) * attack) * level,
          def: def + Math.floor((5 / 100) * def) * level,
          baseExp,
          power: power + Math.floor((5 / 100) * power) * level,
          img1,
          img2,
          summary,
          frontView,
          backView,
          level: userPokemon.level,
          type: types,
        };
      });

      res.status(200).json({
        pokemon: userPokemonData,
        totalPokemon: distinctPokemonCount,
        page,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getEnemies(req, res, next) {
    try {
      const { difficulty } = req.params;
      let top15Pokemon = await Pokemon.findAll({
        limit: 30,
        include: [
          {
            model: Type,
            attributes: ["name", "weakness", "strength", "immune"],
            through: { attributes: [] }, // Exclude the join table attributes
          },
        ],
        order: [], // Random order, you can change the order as per your requirement
      });

      let top3Pokemon = [];
      let check = [];

      function getRandom() {
        const random = Math.floor(Math.random() * top15Pokemon.length);
        let isSame = check.find((el) => el === random);
        if (isSame) return getRandom();
        return random;
      }

      for (let i = 0; i < 3; i++) {
        let random = getRandom();
        let level = Math.ceil(
          Math.random() * (difficulty === "false" ? 2 : 23)
        );

        if (difficulty === "true") level += 7;
        const {
          id,
          name,
          hp,
          attack,
          def,
          baseExp,
          power,
          frontView,
          backView,
          Types,
        } = top15Pokemon[random];
        top3Pokemon.push({
          id,
          name,
          hp: hp + Math.floor((5 / 100) * hp) * (level - 1),
          attack: attack + Math.floor((5 / 100) * attack) * (level - 1),
          def: def + Math.floor((5 / 100) * def) * (level - 1),
          baseExp,
          power: power + Math.floor((5 / 100) * power) * (level - 1),
          frontView,
          backView,
          type: elementWeakness(Types),
          level,
        });
        check.push(random);
      }

      res.status(200).json({ pokemon: top3Pokemon });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async skip(req, res, next) {
    try {
      const player = await User.findByPk(+req.user.id);
      const { draw } = player;

      if (draw < 1) {
        return res.status(200).json({ message: "Draw chance is needed!" });
      }

      const fetchFunction = async () => {
        const random = Math.ceil(Math.random() * 1280);
        const getPokemon = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${random}`
        );
        const randomPokemon = getPokemon.data.results[0];
        const { data: pokemonData } = await axios.get(randomPokemon.url);

        if (
          pokemonData.base_experience === null ||
          pokemonData.sprites.other.dream_world.front_default === null
        ) {
          return fetchFunction();
        }

        return random;
      };

      const data = await fetchFunction();
      await User.update(
        { gacha: +data, draw: draw - 1 },
        {
          where: {
            id: +req.user.id,
          },
        }
      );

      res.status(200).json({ message: "Pokemon Skipped" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getOnePokemon(req, res, next) {
    try {
      const data = await User.findByPk(+req.user.id);
      const getPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1&offset=${data.gacha}`);
      const randomPokemon = getPokemon.data.results[0];
      const pokemonData = await axios.get(randomPokemon.url);
      const pokemonData1 = await axios.get(pokemonData.data.species.url);
  
      let summary, type = [];
      const fte = pokemonData1.data.flavor_text_entries;
      for (let i = 0; i < fte.length; i++) {
        if (fte[i].language.name === "en") {
          summary = fte[i].flavor_text.replace(/\\n|\\f/g, " ").replace(/\n|\f/g, " ");
          break;
        }
      }
  
      const typePromises = pokemonData.data.types.map(el => axios.get(el.type.url));
      const typeResponses = await Promise.all(typePromises);
      type = typeResponses.map(response => response.data.name);
  
      const { stats, base_experience, sprites } = pokemonData.data;
      const baseStatSum = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
      const additionalPower = (base_experience) => base_experience * 0.1;
  
      const pokemon = {
        name: randomPokemon.name,
        attack: stats[1].base_stat,
        hp: stats[0].base_stat,
        def: stats[2].base_stat,
        baseExp: base_experience,
        power: base_experience + baseStatSum + additionalPower(base_experience),
        img1: sprites.other.dream_world.front_default,
        img2: sprites.other["official-artwork"].front_default,
        summary,
        frontView: sprites.front_default,
        backView: sprites.back_default,
        type: type.join(","),
      };
  
      res.status(200).json({ pokemon });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  

  static async addOneToCollection(req, res, next) {
    try {
      let {
        name,
        attack,
        hp,
        def,
        baseExp,
        power,
        img1,
        img2,
        summary,
        frontView,
        backView,
        type,
      } = req.body;

      if (!name) throw { name: "Name is required" };
      else if (!attack) throw { name: "attack is required" };
      else if (!hp) throw { name: "hp is required" };
      else if (!def) throw { name: "def is required" };
      else if (!baseExp) throw { name: "baseExp is required" };
      else if (!power) throw { name: "power is required" };
      else if (!img1) throw { name: "img1 is required" };
      else if (!img2) throw { name: "img2 is required" };
      else if (!summary) throw { name: "summary is required" };
      else if (!frontView) throw { name: "frontView is required" };
      else if (!backView) throw { name: "backView is required" };
      else if (!type) throw { name: "type is required" };

      const [pokemon, pokemonCreated] = await Pokemon.findOrCreate({
        where: { name },
        defaults: {
          name,
          attack,
          hp,
          def,
          baseExp,
          power,
          img1,
          img2,
          summary,
          frontView,
          backView,
        },
      });

      const [userPokemon, created] = await UserPokemon.findOrCreate({
        where: { UserId: +req.user.id, PokemonId: +pokemon.id },
        defaults: {
          UserId: +req.user.id,
          PokemonId: +pokemon.id,
        },
      });

      if (created) {
        type = type.split(",");
        for (const el of type) {
          const typeInstance = await Type.findOne({
            where: { name: el },
          });
          await TypePokemon.create({
            PokemonId: +pokemon.id,
            TypeId: typeInstance.id,
          });
        }

        res
          .status(201)
          .json({ message: "Success add new Pokemon to collection" });
      } else {
        await UserPokemon.update(
          { level: userPokemon.level + 5 },
          { where: { UserId: +req.user.id, PokemonId: +pokemon.id } }
        );
        res.status(201).json({
          message: `User ID ${req.user.id} already possesses ${pokemon.name}, ascended by 5 levels.`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
  static async deleteOneFromCollection(req, res, next) {
    await UserPokemon.destroy({
      where: {
        UserId: +req.user.id,
        PokemonId: +req.params.pokemonId,
      },
    });
    res.status(200).json({ message: "Success Delete Pokemon" });
    try {
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async pokemonLevelUp(req, res, next) {
    const { pokemonId, upLevel } = req.body;

    for (let i = 0; i < pokemonId.length; i++) {
      const userPokemon = await UserPokemon.findOne({
        where: { UserId: +req.user.id, PokemonId: +pokemonId[i] },
      });
      await UserPokemon.update(
        {
          level: userPokemon.level + upLevel,
        },
        {
          where: {
            UserId: +req.user.id,
            PokemonId: +pokemonId[i],
          },
        }
      );
    }

    res.status(200).json({
      message: `Pokemon with id ${pokemonId.join(",")} success Lvl up`,
    });
    try {
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = Pokemons;
