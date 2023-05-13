const { default: axios } = require("axios");
const additionalPower = require("../helper/power");
const { Pokemon } = require("../models");

class Pokemons {
  static async getMyCollection(req, res, next) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const sort = req.query.sort;

      const limit = 50;
      const data = await Pokemon.findAll({
        where: {
          UserId: +req.user.id,
        },
        include: {
          nested: true,
          all: true,
        },
        offset: (page - 1) * limit,
        limit,
        order: sort === "true" ? [["power", "DESC"]] : "",
      });

      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getOneRandom(req, res, next) {
    try {
      const fetchFunction = async () => {
        const random = Math.ceil(Math.random() * 1280);
        const getPokemon = await axios({
          url: `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${random}`,
          method: "GET",
        });
        const randomPokemon = getPokemon.data.results[0];

        const { data: pokemonData } = await axios.get(randomPokemon.url);
        const { data: pokemonData1 } = await axios.get(pokemonData.species.url);

        if (pokemonData.base_experience === null) return fetchFunction();
        else if (pokemonData.sprites.other.dream_world.front_default === null)
          return fetchFunction();

        return [pokemonData, pokemonData1, randomPokemon];
      };
      const data = await fetchFunction();
      const pokemonData = data[0];
      const pokemonData1 = data[1];
      const randomPokemon = data[2];

      let summary;
      const fte = pokemonData1.flavor_text_entries;
      for (let i = 0; i < fte.length; i++) {
        if (fte[i].language.name === "en") {
          summary = fte[i].flavor_text;
          break;
        }
      }

      const pokemon = {
        name: randomPokemon.name,
        attack: pokemonData.stats[1].base_stat,
        hp: pokemonData.stats[0].base_stat,
        def: pokemonData.stats[2].base_stat,
        baseExp: pokemonData.base_experience,
        power:
          pokemonData.base_experience +
          pokemonData.stats[2].base_stat +
          pokemonData.stats[1].base_stat +
          pokemonData.stats[0].base_stat +
          additionalPower(pokemonData.base_experience),
        img1: pokemonData.sprites.other.dream_world.front_default,
        img2: pokemonData.sprites.other["official-artwork"].front_default,
        summary,
      };

      res.status(200).json({ pokemon });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async addOneToCollection(req, res, next) {
    try {
      const { name, attack, hp, def, baseExp, power, img1, img2, summary } =
        req.body;
      const UserId = req.user.id;

      const pokemon = await Pokemon.findOne({
        where: {
          UserId,
          name,
        },
      });
      if (pokemon) return res.status(201).json({ message: "Already have" });

      if (!name) throw { name: "Name is required" };
      else if (!attack) throw { name: "attack is required" };
      else if (!hp) throw { name: "hp is required" };
      else if (!def) throw { name: "def is required" };
      else if (!baseExp) throw { name: "baseExp is required" };
      else if (!power) throw { name: "power is required" };
      else if (!img1) throw { name: "img1 is required" };
      else if (!img2) throw { name: "img2 is required" };
      else if (!summary) throw { name: "summary is required" };

      await Pokemon.create({
        name,
        attack,
        hp,
        def,
        baseExp,
        power,
        img1,
        img2,
        summary,
        UserId,
      });

      res.status(201).json({ message: "Success add new pokemon" });
    } catch (error) {
      if (error.name.indexOf("required") > 0) {
        res.status(400).json({ message: error.name });
      } else {
        res.status(500).json({ error });
      }
    }
  }
  static async deleteOneFromCollection(req, res, next) {
    await Pokemon.destroy({
      where: {
        UserId: +req.user.id,
        id: +req.params.userID,
      },
    });
    res.status(200).json({ message: "Success Delete Pokemon" });
    try {
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = Pokemons;