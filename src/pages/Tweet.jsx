import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import databaseService from "../appwrite/databaseService";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Tweet() {
  const [tweet, setTweet] = useState(null);
  const { docId } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.user);
  const isAuthor = tweet && userData ? tweet.userId === userData.$id : false;

  useEffect(() => {
    if (docId) {
      databaseService.getPost(docId).then((tweet) => {
        if (tweet) setTweet(tweet);
        else navigate("/");
      });
    } else navigate("/");
  }, [docId, navigate]);

  const deleteTweet = () => {
    databaseService.deletePost(tweet.$id).then((status) => {
      if (status) {
        if (tweet.images) databaseService.deleteFile(tweet.images);
        navigate("/");
      }
    });
  };

  return tweet ? (
    <div className="py-8 px-4">
      <Container>
        <div className="w-full flex flex-col lg:flex-row justify-center mb-4 relative border rounded-xl p-4 bg-white shadow-sm">
          {tweet.images && (
            <img
              src={databaseService.getFileURL(tweet.images)}
              alt={tweet.title}
              className="rounded-xl w-full max-w-2xl h-auto object-cover mx-auto mb-4"
            />
          )}

          {isAuthor && (
            <div className="absolute right-4 top-4 flex flex-wrap gap-2 sm:flex-nowrap">
              <Link to={`/edit-tweet/${tweet.$id}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deleteTweet}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="w-full max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{tweet.title}</h1>
        </div>

        {tweet.content && (
          <div className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {parse(tweet.content)}
          </div>
        )}
      </Container>
    </div>
  ) : null;
}

export default Tweet;
