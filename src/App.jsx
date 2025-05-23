import { useState } from 'react';
import './App.css';

import Blacklist from './assets/Blacklist.png';

export default function App() {
  return (
    <div className="flex min-h-screen">
      
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-9">SEJA BEM VINDO AO BLACKLIST</h1>


        <form className="w-full max-w-sm">

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              Login
            </label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu login"
              className="w-full px-3 py-2 text-white bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-red-500 "
            />
          </div>


          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-3 py-2 text-white bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-red-500 "
            />
          </div>


          <div className="mb-4 text-right">
            <a href="#" className="text-sm text-red-400 hover:underline">
              Esqueceu a senha?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirmar
          </button>
        </form>
      </div>

      
      <div className="w-1/2 bg-gray-800 flex items-center justify-center">
        <img
          src={Blacklist}
          alt="Blacklist Logo"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}