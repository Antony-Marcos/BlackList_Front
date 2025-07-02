import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostCard = ({ postId, userToken }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = `https://blacklist-backend.onrender.com/api/posts/${postId}/`;

  useEffect(() => {
    axios
      .get(API_URL, {
        headers: {
          Authorization: userToken ? `Token ${userToken}` : undefined,
        },
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

  const handleLike = () => {
    axios
      .post(
        `https://blacklist-backend.onrender.com/posts/${postId}/like/`,
        {},
        {
          headers: { Authorization: `Token ${userToken}` },
        }
      )
      .then(() => {
        setPost({ ...post, is_liked: true, total_likes: post.total_likes + 1 });
      });
  };

  const handleUnlike = () => {
    axios
      .post(
        `https://blacklist-backend.onrender.com/posts/${postId}/unlike/`,
        {},
        {
          headers: { Authorization: `Token ${userToken}` },
        }
      )
      .then(() => {
        setPost({ ...post, is_unliked: true, total_unlikes: post.total_unlikes + 1 });
      });
  };

  if (loading) return <p>Carregando post...</p>;
  if (error) return <p>{error}</p>;

  // Garante HTTPS nas URLs
  const formatUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-xl mx-auto my-4">
      <h2 className="text-xl font-bold mb-2">Post por {post.author_username}</h2>
      <p className="text-gray-700 mb-2">{post.content}</p>

      {post.video && (
        <video controls className="w-full mb-2 rounded">
          <source src={formatUrl(post.video)} type="video/mp4" />
          Seu navegador não suporta o vídeo.
        </video>
      )}

      {post.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {post.images.map((img) => {
            const imgUrl = formatUrl(img.image);
            return (
              <div key={img.id} className="w-32 h-32">
                <img
                  src={imgUrl}
                  alt="Imagem do Post"
                  className="w-full h-full object-cover rounded border"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded text-white ${
            post.is_liked ? 'bg-green-600' : 'bg-gray-500'
          }`}
        >
          👍 {post.total_likes}
        </button>
        <button
          onClick={handleUnlike}
          className={`px-3 py-1 rounded text-white ${
            post.is_unliked ? 'bg-red-600' : 'bg-gray-500'
          }`}
        >
          👎 {post.total_unlikes}
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-1">Comentários:</h3>
        {post.comments.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id} className="border-t pt-2 mt-2">
              <p className="text-sm font-semibold">{comment.author_username}</p>
              <p className="text-sm">{comment.content}</p>
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
