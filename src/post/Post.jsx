import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostCard = ({ postId, userToken }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reactionError, setReactionError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const API_URL = `https://blacklist-backend.onrender.com/api/posts/${postId}/`;

  // Buscar post
  useEffect(() => {
    axios
      .get(API_URL, {
        headers: userToken ? { Authorization: `Token ${userToken}` } : {},
      })
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Erro ao carregar post.');
        setLoading(false);
      });
  }, [postId, userToken]);

  // Reagir
  const handleReaction = (type) => {
    if (!userToken) {
      setReactionError('Você precisa estar logado para reagir.');
      return;
    }

    axios
      .post(
        `https://blacklist-backend.onrender.com/posts/${postId}/react/${type}/`,
        {},
        {
          headers: { Authorization: `Token ${userToken}` },
        }
      )
      .then(() => {
        setPost((prev) => {
          if (type === 'like') {
            const liked = !prev.is_liked;
            const wasDisliked = prev.is_unliked;
            return {
              ...prev,
              is_liked: liked,
              is_unliked: liked ? false : prev.is_unliked,
              total_likes: liked ? prev.total_likes + 1 : prev.total_likes - 1,
              total_unlikes:
                wasDisliked && liked ? prev.total_unlikes - 1 : prev.total_unlikes,
            };
          } else if (type === 'dislike') {
            const disliked = !prev.is_unliked;
            const wasLiked = prev.is_liked;
            return {
              ...prev,
              is_unliked: disliked,
              is_liked: disliked ? false : prev.is_liked,
              total_unlikes: disliked ? prev.total_unlikes + 1 : prev.total_unlikes - 1,
              total_likes:
                wasLiked && disliked ? prev.total_likes - 1 : prev.total_likes,
            };
          }
          return prev;
        });
        setReactionError('');
      })
      .catch(() => {
        setReactionError('Erro ao enviar reação. Verifique se está logado.');
      });
  };

  // Enviar comentário
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setCommentError('O comentário não pode estar vazio.');
      return;
    }

    axios
      .post(
        `https://blacklist-backend.onrender.com/posts/${postId}/comments/create/`,
        { content: trimmedComment },
        {
          headers: {
            Authorization: `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setPost((prev) => ({
          ...prev,
          comments: [...prev.comments, res.data],
        }));
        setCommentText('');
        setCommentError('');
      })
      .catch(() => {
        setCommentError('Erro ao enviar comentário. Verifique se está logado.');
      });
  };

  const formatUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  };

  if (loading) return <p>Carregando post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-700 border rounded-lg shadow-md p-4 w-full max-w-[500px] mx-auto my-6 grid gap-4">
      <h2 className="text-xl text-white font-bold">Post por {post.author_username}</h2>
      <p className="text-gray-300">{post.content}</p>

      {post.video && (
        <video controls className="w-full rounded">
          <source src={formatUrl(post.video)} type="video/mp4" />
          Seu navegador não suporta o vídeo.
        </video>
      )}

      {post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.images.map((img) => (
            <div key={img.id} className="w-full h-32">
              <img
                src={formatUrl(img.image)}
                alt="Imagem do Post"
                className="w-full h-full object-cover rounded border"
              />
            </div>
          ))}
        </div>
      )}

      {/* Botões de reação */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleReaction('like')}
          className={`px-3 py-1 rounded text-white ${
            post.is_liked ? 'bg-green-600' : 'bg-gray-500'
          }`}
        >
          👍 {post.total_likes}
        </button>
        <button
          onClick={() => handleReaction('dislike')}
          className={`px-3 py-1 rounded text-white ${
            post.is_unliked ? 'bg-red-600' : 'bg-gray-500'
          }`}
        >
          👎 {post.total_unlikes}
        </button>
      </div>

      {reactionError && <p className="text-sm text-red-400 mt-2">{reactionError}</p>}

      {/* Área de comentários estilizada e compacta */}
      <div className="bg-gray-800 rounded-xl p-4 mt-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4 flex items-center gap-2">
          💬 Comentários
        </h3>

        {userToken ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              placeholder="Escreva seu comentário..."
              rows="2"
            />
            {commentError && (
              <p className="text-sm text-red-400 mt-1">{commentError}</p>
            )}
            <button
              type="submit"
              className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium rounded-md shadow-sm text-sm"
            >
              Comentar
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-400 mb-4">
            Você precisa estar logado para comentar.
          </p>
        )}

        {post.comments.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nenhum comentário ainda.</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-500 transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {comment.author_username[0].toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-white">
                    {comment.author_username}
                  </p>
                </div>
                <p className="text-sm text-gray-300 leading-snug">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
