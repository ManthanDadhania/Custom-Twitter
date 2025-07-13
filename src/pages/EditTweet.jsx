import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/Container/Container';
import TweetForm from '../components/tweet-form/TweetForm';
import databaseService from '../appwrite/databaseService';

function EditTweet() {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { docId } = useParams();

  useEffect(() => {
    if (docId) {
      databaseService.getPost(docId).then((data) => {
        if (data) {
          setPost(data);
        }
      });
    } else {
      navigate("/");
    }
  }, [docId, navigate]);

  return post ? (
    <Container>
      <TweetForm tweet={post} />
    </Container>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}

export default EditTweet;
