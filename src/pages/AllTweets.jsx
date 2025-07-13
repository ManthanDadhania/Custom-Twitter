import React, { useEffect, useState } from 'react';
import Container from '../components/Container/Container';
import TweetCard from '../components/TweetCard';
import databaseService from '../appwrite/databaseService';

function AllTweets() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await databaseService.getPosts();
        setTweets(response.documents);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, []);

  return (
    <div className="py-6 px-4">
      <Container>
        {loading ? (
          <p className="text-center text-gray-500">Loading tweets...</p>
        ) : tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard key={tweet.$id} $id={tweet.$id} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tweets available</p>
        )}
      </Container>
    </div>
  );
}

export default AllTweets;
