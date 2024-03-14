import Users from "../entity/userEntity";
import { IQuery } from "../types/types";

class PokemonService {
  private readonly pokeApi = process.env.POKEMON_API_URL!;

  private sort(array: Array<any>, order?: string) {
    if (order === "-") {
      return array
        .sort((a: any, b: any) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .reverse();
    }

    return array.sort((a: any, b: any) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
  async getAll(pageNumber?: string) {
    try {
      if (pageNumber) {
        const offset = +pageNumber * 20 - 20;
        console.log(offset);
        const res = await fetch(
          `${this.pokeApi}/pokemon?offset=${offset}&limit=20`
        );
        return await res.json();
      }
      const res = await fetch(`${this.pokeApi}/pokemon`);
      return await res.json();
    } catch (error: any) {
      throw new Error("Error getting all pokemon " + error.message);
    }
  }

  async getById(pokemonId: Number) {
    try {
      const res = await fetch(`${this.pokeApi}/ability/${pokemonId}`);
      return await res.json();
    } catch (error: any) {
      throw new Error("Error getting all pokemon " + error.message);
    }
    const res = await fetch(`${this.pokeApi}/ability/${pokemonId}`);
    return await res.json();
  }
  catch(error: any) {
    throw new Error("Error getting all pokemon " + error.message);
  }

  async getTypes() {
    try {
      const types = [];
      for (let i = 0; i < 19; ++i) {
        const res = await fetch(`${this.pokeApi}/type/${i}`);
        const data = await res.json();
        if (data) {
          types.push(data);
        }
      }
      return types;
    } catch (error: any) {
      throw new Error("Error getting all pokemon types " + error.message);
    }
  }

  async filterPokemon({ filter, sort }: IQuery, userId: string) {
    try {
      if (filter === "catch") {
        const catchedPokemonId = await Users.findById(userId)
          .select("cachedPokemon")
          .lean();
        const ids = catchedPokemonId?.cachedPokemon || [];
        const pokemons = [];
        for (let i = 0; i < ids.length; ++i) {
          const pokemon = await this.getById(+ids[i]);
          pokemons.push(pokemon);
        }

        if (sort && sort.includes("-")) {
          return this.sort(pokemons, "-");
        }
        return this.sort(pokemons);
      }
    } catch (error: any) {
      throw new Error("Error filtering pokemon " + error.message);
    }
  }

  async searchPokemon(pokemonName: string) {
    try {
      const res = await fetch(`${this.pokeApi}/pokemon/${pokemonName}`);
      return await res.json();
    } catch (error: any) {
      throw new Error("Error getting all pokemon " + error.message);
    }
  }
}

export default PokemonService;
