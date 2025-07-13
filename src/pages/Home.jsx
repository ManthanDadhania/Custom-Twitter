import React, { useEffect, useState } from 'react';
import Container from '../components/Container/Container';
import databaseService from '../appwrite/databaseService';
import TweetCard from '../components/TweetCard';

function Home() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await databaseService.getPosts();
        console.log("Fetched tweets:", response.documents);
        setTweets(response.documents);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };
    fetchTweets();
  }, []);

  return (
    <div className="py-6 px-4">
      <Container>
        {Array.isArray(tweets) && tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard key={tweet.$id} {...tweet} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tweets available</p>
        )}
      </Container>
    </div>
  );
}

export default Home;
