import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostCard = ({ postId, userToken }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reactionError, setReactionError] = useState('');
  const API_URL = `https://blacklist-backend.onrender.com/api/posts/${postId}/`;

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
              total_unlikes: wasDisliked && liked ? prev.total_unlikes - 1 : prev.total_unlikes,
            };
          } else if (type === 'dislike') {
            const disliked = !prev.is_unliked;
            const wasLiked = prev.is_liked;

            return {
              ...prev,
              is_unliked: disliked,
              is_liked: disliked ? false : prev.is_liked,
              total_unlikes: disliked ? prev.total_unlikes + 1 : prev.total_unlikes - 1,
              total_likes: wasLiked && disliked ? prev.total_likes - 1 : prev.total_likes,
            };
          }
          return prev;
        });
        setReactionError('');
      })
      .catch((err) => {
        console.error(err);
        setReactionError('Erro ao enviar reação. Verifique se está logado.');
      });
  };

  const formatUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  };

  if (loading) return <p>Carregando post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-700 border rounded-lg shadow-md p-4 w-full max-w-[350px] mx-auto my-4 grid gap-4">
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

      {reactionError && (
        <p className="text-sm text-red-400 mt-2">{reactionError}</p>
      )}

      <div>
        <h3 className="text-md font-semibold text-white">Comentários:</h3>
        {post.comments.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum comentário ainda.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id} className="border-t pt-2 mt-2">
              <p className="text-sm font-semibold text-white">{comment.author_username}</p>
              <p className="text-sm text-gray-300">{comment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostCard;
