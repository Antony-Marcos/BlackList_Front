import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './post/Post';
import Header from '../components/header';
import axios from 'axios';

export default function Inicial() {
  const [content, setContent] = useState('');
  const [jogoId, setJogoId] = useState('');
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoadingJogos, setIsLoadingJogos] = useState(true);
  const [lastPostId, setLastPostId] = useState(null);

  const userToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Buscar os jogos disponíveis
  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const response = await axios.get('https://blacklist-backend.onrender.com/api/jogos/');
        setJogos(response.data);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
        alert('Erro ao carregar jogos.');
      } finally {
        setIsLoadingJogos(false);
      }
    };

    fetchJogos();
  }, []);

  // Buscar os posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blacklist-backend.onrender.com/api/posts/', {
          headers: userToken ? { Authorization: `Token ${userToken}` } : {},
        });
         console.log("Resposta da API posts:", response.data); 
        setPosts(response.data.reverse()); // Mostra os mais recentes primeiro
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        alert('Erro ao carregar posts.');
      }
    };

    fetchPosts();
  }, [userToken]);

  const handlePostSubmit = async () => {
    if (!userToken) {
      alert('Você precisa estar logado para postar.');
      return navigate('/');
    }

    if (!content.trim() || !jogoId) {
      alert('Preencha a descrição e selecione um jogo.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('jogo', jogoId);
    if (video) formData.append('video', video);
    images.forEach((img) => formData.append('images', img));

    try {
      const response = await axios.post(
        'https://blacklist-backend.onrender.com/api/posts/create/',
        formData,
        {
          headers: {
            Authorization: `Token ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Post enviado com sucesso!');
      setLastPostId(response.data.id);
      setContent('');
      setVideo(null);
      setImages([]);
      setJogoId('');
      setPosts((prev) => [response.data, ...prev]);
    } catch (error) {
      if (error.response) {
        console.error('Erro ao enviar post:', error.response.data);
        alert('Erro ao enviar post:\n' + JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error);
        alert('Erro de rede ou servidor fora do ar.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-2">
      <Header />

      <div className="bg-gray-800 p-4 rounded shadow-lg mb-8">
        <textarea
          className="w-full bg-gray-700 p-2 rounded resize-none text-white"
          placeholder="Descreva o ocorrido..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minLength={5}
          maxLength={5000}
          rows={4}
        />

        {isLoadingJogos ? (
          <p className="text-gray-400 mt-2">Carregando jogos...</p>
        ) : (
          <select
            className="bg-gray-700 text-white mt-2 p-2 rounded w-full"
            value={jogoId}
            onChange={(e) => setJogoId(e.target.value)}
          >
            <option value="">Selecione o jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.nome}
              </option>
            ))}
          </select>
        )}

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Vídeo:</label>
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded inline-block w-full text-center">
              {video ? video.name : 'Selecionar vídeo'}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Imagens:</label>
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded inline-block w-full text-center">
              {images.length > 0 ? `${images.length} imagem(ns) selecionada(s)` : 'Selecionar imagens'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages([...e.target.files])}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="h-20 w-full object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="bg-green-600 px-5 py-2 rounded mt-4 hover:bg-green-700"
          onClick={handlePostSubmit}
        >
          Enviar Postagem
        </button>
      </div>

      {/* Lista de posts */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  ">
          {posts.map((post) => (
            <PostCard key={post.id} postId={post.id} userToken={userToken} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Nenhum post ainda.</p>
      )}
    </div>
  );
}
