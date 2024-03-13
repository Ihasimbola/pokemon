class PokemonService {
  private readonly pokeApi = process.env.POKEMON_API_URL!;
  async getAll() {
    try {
      const res = await fetch(`${this.pokeApi}/pokemon`);
      return await res.json();
    } catch (error: any) {
      throw new Error("Error getting all pokemon " + error.message);
    }
  }

  async getById(pokemonId : Number) {
    try {
        const res = await fetch(`${this.pokeApi}/ability/${pokemonId}`);
        return await res.json();
      } catch (error: any) {
        throw new Error("Error getting all pokemon " + error.message);
      }
  }
}

export default PokemonService;
