import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Blacklist from '../src/assets/Blacklist.png';


export default function Inicial() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simula autenticação
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para acessar esta funcionalidade.');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const postMock = {
    username: 'João Gamer',
    game: 'Counter Strike 2',
    title: 'Partida insana hoje!',
    description: 'Joguei demais! Olha essa jogada!',
    media: 'https://via.placeholder.com/400x200.png',
    comments: 5,
    likes: 20,
    dislikes: 1
  };

  return (
    <div className="min-h-screen bg-black text-white p-2">
      {/* Inputs de navegação */}
     <Header />

      {/* Modal de Postagem */}
      <div className="bg-gray-800 p-4 rounded shadow-lg mb-8">
        <textarea 
          className="w-full bg-gray-700 p-2 rounded resize-none text-white"
          placeholder="O que deseja postar?"
          minLength={5}
          maxLength={5000}
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          <button className="bg-gray-900 px-3 py-1 rounded hover:bg-gray-700">Título</button>
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-900">Emoji</button>
          <button className="bg-gray-900 px-3 py-1 rounded hover:bg-gray-700">Foto</button>
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-900">Vídeo</button>
          <button className="bg-gray-900 px-3 py-1 rounded hover:bg-gray-700">Marcar Pessoas</button>
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-900">GIF</button>
        </div>
        <button className=' bg-green-600 px-5 py-1 rounded mb-6 mt-9'>Enviar</button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded shadow">
            <div className="text-xl font-bold">{postMock.title}</div>
            <div className="text-sm text-gray-400">{postMock.username} - {postMock.game}</div>
            <img src={Blacklist} alt="media" className="h-50 w-auto rounded" />
            <p>{postMock.description}</p>
            <div className="flex gap-4 mt-2">
              <button className="text-blue-400">Comentários ({postMock.comments})</button>
              <button className="text-green-400">Like ({postMock.likes})</button>
              <button className="text-red-400">Dislike ({postMock.dislikes})</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
