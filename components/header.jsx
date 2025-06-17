import Blacklist from '../src/assets/Blacklist.png';

export default function Header() {
  return (
    <header className="bg-black text-white py-9 shadow-md">
      <div className="container mx-auto grid grid-cols-3 items-center px-4">
        {/* Menu esquerdo */}
        <nav className="flex space-x-10 text-sm font-medium justify-start">
          <a href="#" className="hover:text-red-500">Home</a>
          <a href="#" className="hover:text-red-500">Sobre</a>

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

        {/* Logo centralizada */}
        <div className="flex justify-center">
          <img src={Blacklist} className="h-20 w-auto max-w-[120px]" alt="Blacklist" />
        </div>

        {/* Espaço à direita (futuro avatar/login) */}
        <div className="flex justify-end">
          {/* Pode colocar ícones de usuário ou botão de login futuramente */}
        </div>
      </div>
    </header>
  );
}
