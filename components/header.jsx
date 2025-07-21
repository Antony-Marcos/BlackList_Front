import { useState } from 'react';
import Blacklist from '../src/assets/Blacklist.png';
import { Menu, X } from 'lucide-react'; // ícones

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={Blacklist} alt="Blacklist" className="h-12 w-auto max-w-[100px]" />
        </div>

        {/* Botão hamburguer (visível apenas em telas pequenas) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu normal (visível apenas em telas md ou maiores) */}
        <nav className="hidden md:flex space-x-10 text-sm font-medium">
          <a href="#" className="hover:text-red-500">Home</a>
          <a href="#" className="hover:text-red-500">Sobre</a>

          {/* Dropdown */}
          <div className="relative group">
            <button className="hover:text-red-500">Jogos ▾</button>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded shadow-md z-10">
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">Valorant</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">CS2</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">Dota 2</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-800">PUBG</a>
            </div>
          </div>

          <a href="#" className="hover:text-red-500">Contato</a>
        </nav>
      </div>

      {/* Menu mobile (visível quando isOpen === true) */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-4 pb-4 space-y-2 text-sm font-medium">
          <a href="#" className="block hover:text-red-500">Home</a>
          <a href="#" className="block hover:text-red-500">Sobre</a>

          <div>
            <span className="block text-gray-400">Jogos</span>
            <a href="#" className="block pl-4 py-1 hover:text-red-500">Valorant</a>
            <a href="#" className="block pl-4 py-1 hover:text-red-500">CS2</a>
            <a href="#" className="block pl-4 py-1 hover:text-red-500">Dota 2</a>
            <a href="#" className="block pl-4 py-1 hover:text-red-500">PUBG</a>
          </div>

          <a href="#" className="block hover:text-red-500">Contato</a>
        </div>
      )}
    </header>
  );
}
