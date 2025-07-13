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
    <div className="py-8">
      <Container>
        <div className="w-full flex flex-col lg:flex-row justify-center mb-4 relative border rounded-xl p-2">
          {tweet.images && (
            <img
              src={databaseService.getFileURL(tweet.images)}
              alt={tweet.title}
              className="rounded-xl max-w-full h-auto"
            />
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6 flex gap-2">
              <Link to={`/edit-tweet/${tweet.$id}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deleteTweet}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{tweet.title}</h1>
        </div>

        <div className="text-sm text-gray-700">
  {tweet.title}
</div>

      </Container>
    </div>
  ) : null;
}

export default Tweet;