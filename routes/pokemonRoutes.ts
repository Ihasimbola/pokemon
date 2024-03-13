import express from 'express';
import { verifyToken } from '../utils/jwt';
import { PokemonController } from '../controllers/pokemonController';

const router = express.Router();

router.get('/', [verifyToken, PokemonController.getAll]);

// Get Pokemon By ID
router.get('/detail/:id', [verifyToken, PokemonController.getPokemonById]);

// Search pokemon by name

router.get('/search', [verifyToken, PokemonController.searchPokemon]);

router.post('/catch/:id', [verifyToken, PokemonController.catch]);
router.post('/release/:id', [verifyToken, PokemonController.release]);

export { router };
