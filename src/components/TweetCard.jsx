import React, { useEffect, useState } from 'react';
import Container from './Container/Container';
import profileDetails from '../appwrite/profileService';
import databaseService from '../appwrite/databaseService';
import { useSelector } from 'react-redux';
import authSlice from '../store/authSlice';
function TweetCard({ $id }) {
  const [tweet, setTweet] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const { userData, status: authStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tweetDoc = await databaseService.getPost($id);
        setTweet(tweetDoc);

        if (tweetDoc?.userId) {
          const profile = await profileDetails.getUserProfile(tweetDoc.userId);
         if (profile) {
          setAuthorProfile(profile);
        } else {
          console.warn('Profile not found for userId:', tweetDoc.userId);
        }
        }
      } catch (error) {
        console.error("Failed to fetch tweet or profile", error);
      }
    };

    fetchData();
  }, [$id]);

  if (!tweet || !authorProfile) return null;

  const profileImage = authorProfile.profileImage
  ? profileDetails.getFileURL(authorProfile.profileImage)
  : null;


  const usernameInitial = authorProfile.username
    ? authorProfile.username.charAt(0).toUpperCase()
    : 'U';

  const tweetImageURL = tweet.images ? profileDetails.getFileURL(tweet.images) : null;

  return (
    <Container>
      <div className="p-5 border-b border-gray-200 w-full max-w-xl mx-auto bg-white rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-start gap-4 transition-all hover:bg-gray-50">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt="User avatar"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
              {usernameInitial}
            </div>
          )}
        </div>

        {/* Tweet Content */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
            <p className="text-sm font-medium text-gray-800">{authorProfile.username}</p>
            <p className="text-xs text-gray-500">@{authorProfile.userId}</p>

          </div>

          <div className="text-base text-gray-800">{tweet.title}</div>

          {tweetImageURL && (
            <img
              src={tweetImageURL}
              alt="Tweet media"
              className="mt-3 max-h-96 w-full rounded-md object-cover border border-gray-200"
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default TweetCard;
