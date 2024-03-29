import { Request, Response } from "express";
import Users from "../entity/userEntity";
import PokemonService from "../services/pokemonService";

export class PokemonController {
  static async getAll(req: Request, res: Response) {
    const pokemonService = new PokemonService();
    try {
      const data = await pokemonService.getAll();
      return res.status(200).json({
        data,
      });
    } catch (error: any) {
      throw new Error("Error getting all pokemon " + error.message);
    }
  }
  static async catch(req: Request, res: Response) {
    try {
      const pokemonId = req.params.id;
      const user = await Users.findById(req.body.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const cachedPokemon = user?.cachedPokemon;
      if (cachedPokemon?.includes(pokemonId)) {
        return res
          .status(200)
          .json({ message: "Already catched", id: pokemonId });
      }
      user?.cachedPokemon?.push(pokemonId);

      user?.save();
      return res.status(200).json({ message: "Catched" });
    } catch (error: any) {
      throw new Error("Error catching pokemon " + error.message);
    }
  }

  static async release(req: Request, res: Response) {
    try {
      const pokemonId = req.params.id;
      const user = await Users.findById(req.body.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const indexOfPokemonId = user?.cachedPokemon?.indexOf(pokemonId);
      if (indexOfPokemonId) {
        user.cachedPokemon?.splice(indexOfPokemonId, 1);
        user.save();
        return res.status(200).json({ message: "Released", id: pokemonId });
      }
      return;
    } catch (error) {
      throw new Error("Error releasing pokemon " + error);
    }
  }
}
