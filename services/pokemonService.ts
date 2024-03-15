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

  private async searchIfCatchedPokemon(
    userId: string | number,
    pokemons: Array<any>
  ) {
    try {
      let id = "";
      const user = await Users.findById(userId).lean().select("cachedPokemon");
      for (let i = 0; i < pokemons.length; ++i) {
        const splittedUrl = pokemons[i].url.split("/");
        id = splittedUrl[splittedUrl.length - 2];
        if (user?.cachedPokemon?.includes(id)) {
          pokemons[i]["isCatched"] = true;
        } else {
          pokemons[i]["isCatched"] = false;
        }
        pokemons[i]["id"] = id;
      }
      return pokemons;
    } catch (error) {
      throw new Error("Error in search if catched pokemon " + error);
    }
  }
  async getAll(userId: string, pageNumber?: string) {
    let pokemons: any = [];
    try {
      if (pageNumber) {
        const offset = +pageNumber * 20 - 20;
        pokemons = await (
          await fetch(`${this.pokeApi}/pokemon?offset=${offset}&limit=20`)
        ).json();
      } else {
        pokemons = await (await fetch(`${this.pokeApi}/pokemon`)).json();
      }

      for (let i = 0; i < pokemons.results.length; ++i) {
        const pokemon: any = await (
          await fetch(`${pokemons.results[i].url}`)
        ).json();

        pokemons.results[i]["sprites"] = pokemon.sprites;
      }

      pokemons.results = await this.searchIfCatchedPokemon(
        userId,
        pokemons.results
      );

      return pokemons;
    } catch (error: any) {
      throw new Error(error.stack);
    }
  }

  async getById(pokemonId: Number) {
    try {
      const res = await fetch(`${this.pokeApi}/pokemon/${pokemonId}`);
      const data = await res.json();
      return data;
    } catch (error: any) {
      throw new Error(error.stack);
    }
  }

  async getTypes(typeId?: string | undefined) {
    try {
      if (typeId) {
        const types = await fetch(`${this.pokeApi}/type/${typeId}`);
        return await types.json();
      }
      const types = await fetch(`${this.pokeApi}/type`);
      return await types.json();
    } catch (error: any) {
      throw new Error(error.stack);
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
          const { id, name, abilities, sprites, types } = pokemon;
          pokemons.push({
            id,
            name,
            types,
            sprites,
          });
        }

        if (sort && sort.includes("-")) {
          return this.sort(pokemons, "-");
        }
        return this.sort(pokemons);
      }
    } catch (error: any) {
      throw new Error(error.stack);
    }
  }

  async searchPokemon(pokemonName: string) {
    try {
      const res = await fetch(`${this.pokeApi}/pokemon/${pokemonName}`);
      return await res.json();
    } catch (error: any) {
      throw new Error(error.stack);
    }
  }
}

export default PokemonService;
