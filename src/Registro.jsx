import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmpassword , setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [mpassword, setMpassword] = useState(true); 
  const [tpassword, setTpassword] = useState(true);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await axios.post(
        'https://blacklist-backend.onrender.com/api/users/register/',
        { username, password, email, confirmpassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErro('Erro ao cadastrar. Verifique os dados ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
        <form onSubmit={handleRegister}>
          {erro && <p className="text-red-500 mb-4">{erro}</p>}
          <input
            type="text"
            placeholder="Insira o nome do usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded"
            required
          />
          <input
          type='email'
          placeholder='Insira o e-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded'
          required
          />



          <div className='relative'>
          <input
            type={mpassword ? 'password': 'text'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded"
            required
          />
            <button
              type="button"
              onClick={() => setMpassword(!mpassword)}
              className="absolute right-3 top-3 text-white focus:outline-none"
            >
              {mpassword ? '👁️‍🗨️' : '👁️'}
            </button>
            </div>


            <div className='relative'>
          <input
            type={tpassword ? 'password' : 'text'}
            placeholder="Confirmar senha"
            value={confirmpassword}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded"
            required
          />
          <button
          type='button'
          onClick={() => setTpassword(!tpassword)}
          className='absolute right-3 top-3 text-white focus:outline-none'
          >
            {mpassword ? '👁️‍🗨️' : '👁️'}
          </button>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400  text-center">
          Já tem conta?{' '}
          <Link to="/" className="text-red-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
