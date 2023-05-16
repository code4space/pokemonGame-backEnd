const { default: axios } = require("axios");
const additionalPower = require("../helper/power");
const { Pokemon, User, UserPokemon, Type, TypePokemon } = require("../models");

class Pokemons {
  static async getMyCollection(req, res, next) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const sort = req.query.sort; //
      const limit = 50;

      const { count, rows } = await UserPokemon.findAndCountAll({
        where: { UserId: +req.user.id },
        limit,
        offset: (page - 1) * limit,
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
              "createdAt",
              "updatedAt",
            ],
            include: [
              {
                model: Type,
                attributes: ["name", "weakness", "strength", "immune"],
                through: { attributes: [] }, // Exclude join table attributes
              },
            ],
          },
        ],
        order: sort === "true" ? [[{ model: Pokemon }, "power", "DESC"]] : [],
      });

      const userPokemonData = rows.map((userPokemon) => {
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
          createdAt,
          updatedAt,
        } = userPokemon.Pokemon;

        const types = userPokemon.Pokemon.Types;
        return {
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
          createdAt,
          updatedAt,
          type: types,
        };
      });

      res
        .status(200)
        .json({ pokemon: userPokemonData, totalPokemon: count, page });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async skip(req, res, next) {
    try {
      const fetchFunction = async () => {
        const random = Math.ceil(Math.random() * 1280);
        const getPokemon = await axios({
          url: `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${random}`,
          method: "GET",
        });
        const randomPokemon = getPokemon.data.results[0];

        const { data: pokemonData } = await axios.get(randomPokemon.url);

        if (pokemonData.base_experience === null) return fetchFunction();
        else if (pokemonData.sprites.other.dream_world.front_default === null)
          return fetchFunction();

        return random;
      };

      const data = await fetchFunction();
      const player = await User.findOne({
        where: {
          id: +req.user.id,
        },
      });
      const { draw } = player;

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
      const data = await User.findOne({
        where: {
          id: +req.user.id,
        },
      });

      const getPokemon = await axios({
        url: `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${data.gacha}`,
        method: "GET",
      });

      const randomPokemon = getPokemon.data.results[0];
      const { data: pokemonData } = await axios.get(randomPokemon.url);
      const { data: pokemonData1 } = await axios.get(pokemonData.species.url);

      let summary,
        type = [];
      const fte = pokemonData1.flavor_text_entries;
      for (let i = 0; i < fte.length; i++) {
        if (fte[i].language.name === "en") {
          summary = fte[i].flavor_text
            .replace(/\\n|\\f/g, " ")
            .replace(/\n|\f/g, " ");
          break;
        }
      }
      pokemonData.types.forEach((el) => {
        type.push(el.type.name);
      });

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
      let { name, attack, hp, def, baseExp, power, img1, img2, summary, type } =
        req.body;

      if (!name) throw { name: "Name is required" };
      else if (!attack) throw { name: "attack is required" };
      else if (!hp) throw { name: "hp is required" };
      else if (!def) throw { name: "def is required" };
      else if (!baseExp) throw { name: "baseExp is required" };
      else if (!power) throw { name: "power is required" };
      else if (!img1) throw { name: "img1 is required" };
      else if (!img2) throw { name: "img2 is required" };
      else if (!summary) throw { name: "summary is required" };
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
        console.log(type)
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
        res.status(201).json({
          message: `User with id ${req.user.id} already have ${pokemon.name}`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
  static async deleteOneFromCollection(req, res, next) {
    console.log(req.params.pokemonId);
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
}

module.exports = Pokemons;
