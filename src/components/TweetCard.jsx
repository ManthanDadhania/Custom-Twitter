import React, { useEffect, useState } from 'react';
import profileDetails from '../appwrite/profileService';
import databaseService from '../appwrite/databaseService';
import { useSelector } from 'react-redux';

function TweetCard({ $id }) {
  const [tweet, setTweet] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);

  const { userData, status: authStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      const tweetDoc = await databaseService.getPost($id);
      setTweet(tweetDoc);
      if (tweetDoc?.userId) {
        const profile = await profileDetails.getUserProfile(tweetDoc.userId);
        setAuthorProfile(profile);
      }
    };
    fetchData();
  }, [$id]);

  if (!tweet || !authorProfile) return null;

  const profileImage = authorProfile.profileImage
    ? profileDetails.getFileURL(authorProfile.profileImage)
    : null;

  const tweetImageURL = tweet.images ? profileDetails.getFileURL(tweet.images) : null;

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 flex gap-4 w-full">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        {profileImage ? (
          <img
            src={profileImage}
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
            {authorProfile.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Tweet Content */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {authorProfile.username}
          <span className="text-xs text-gray-400">@{authorProfile.userId}</span>
        </div>

        <div className="mt-1 text-gray-700 text-base whitespace-pre-line">
          {tweet.title}
        </div>

        {tweetImageURL && (
          <img
            src={tweetImageURL}
            alt="Tweet Media"
            className="mt-3 rounded-md max-h-96 object-cover border border-gray-200"
          />
        )}
      </div>
    </div>
  );
}

export default TweetCard;
