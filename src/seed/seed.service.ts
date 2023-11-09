import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly PokemonService: PokemonService
  ){}

  private readonly axios: AxiosInstance = axios;


  async executeSeed(){


    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const insertPromisesArray = [];

    data.results.forEach(({name, url})=>{

      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];

      const createPokemonDto: CreatePokemonDto = {
        no,
        name
      }

      // const pokemon = this.PokemonService.create(createPokemonDto)
      // console.log(name, no);

      insertPromisesArray.push(
        this.PokemonService.create(createPokemonDto)
      )

    });

    await Promise.all(insertPromisesArray)

    return "Seed EXECUTED";


  }



}
