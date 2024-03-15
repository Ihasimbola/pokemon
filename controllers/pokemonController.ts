import { Request, Response } from "express";
import Users from "../entity/userEntity";
import PokemonService from "../services/pokemonService";

export class PokemonController {
  static pokemonService = new PokemonService();
  static async getAll(req: Request, res: Response) {
    try {
      const data = await PokemonController.pokemonService.getAll(
        req.body.userId,
        req.query.page?.toString()
      );
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

  static async getTypes(req: Request, res: Response) {
    const typeId = req.params.typeId?.toString() || "";
    try {
      const data = await PokemonController.pokemonService.getTypes(typeId);
      return res.status(200).json({
        data,
      });
    } catch (error: any) {
      throw new Error("Error getting all pokemon types " + error.message);
    }
  }

  static async getPokemonById(req: Request, res: Response) {
    try {
      const pokemonId = parseInt(req.params.id);
      const pokemon = await PokemonController.pokemonService.getById(pokemonId);
      return res.json(pokemon);
    } catch (error) {
      throw new Error("Error releasing pokemon " + error);
    }
  }

  static async searchPokemon(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const pokemon = await PokemonController.pokemonService.searchPokemon(
        query as string
      );
      return res.json(pokemon);
    } catch (error) {
      throw new Error("Error releasing pokemon " + error);
    }
  }
  static async filterPokemon(req: Request, res: Response) {
    try {
      // const pokemonService = new PokemonService();
      const filter = req.query.filter?.toString()!;
      const sort = req.query.sort?.toString() || "";
      const userId = req.body.userId;
      const data = await PokemonController.pokemonService.filterPokemon(
        { filter, sort },
        userId
      );
      return res.status(200).json({
        data,
      });
    } catch (error) {
      throw new Error("Error filtering pokemon " + error);
    }
  }
}
