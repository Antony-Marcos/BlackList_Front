import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Blacklist from './assets/Blacklist.png';

export default function App() {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mpassword, setMpassword] = useState(true);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ rota correta: /api/token/
      const response = await axios.post(
        'https://blacklist-backend.onrender.com/api/token/',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ✅ Django JWT retorna "access" e "refresh"
      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      console.log('Login bem-sucedido!');
      navigate('/inicial'); // redireciona após login
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      setError('Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 bg-neutral-900 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-9">SEJA BEM VINDO AO BLACKLIST</h1>

        <form className="w-full max-w-sm" onSubmit={login}>
          {error && <p className="text-red-500 mb-5">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              Login
            </label>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Usuário"
              onChange={(e) => setusername(e.target.value)}
              className="w-full px-3 py-2 text-white bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type={mpassword ? 'password' : 'text'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-3 py-2 text-white bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setMpassword(!mpassword)}
              className="absolute right-3 top-9 text-white focus:outline-none"
            >
              {mpassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>

          <div className="mb-4 text-right">
            <a href="#" className="text-sm text-red-400 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Confirmar'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Não tem conta?{' '}
              <Link to="/registro" className="text-red-400 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="w-1/2 bg-gray-800 items-center justify-center hidden md:flex">
        <img src={Blacklist} alt="Blacklist" className="w-full h-full" />
      </div>
    </div>
  );
}
