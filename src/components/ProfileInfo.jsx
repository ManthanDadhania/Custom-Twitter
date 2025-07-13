import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from './Container/Container';
import { logout } from '../store/authSlice';
import profileDetails from '../appwrite/profileService';
import databaseService from '../appwrite/databaseService';
import TweetCard from './TweetCard';
import Button from './Button';

function ProfileInfo() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [profileImgFile, setProfileImgFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const profileRes = await profileDetails.getUserProfile(user.$id);
        setProfile(profileRes);
        setBio(profileRes?.bio || '');
        setUsername(profileRes?.username || '');

        if (profileRes?.profileImage) {
          const url = profileDetails.getFileURL(profileRes.profileImage);
          setImageURL(url);
        }

        const tweetsRes = await databaseService.getPosts();
        const userTweets = tweetsRes.documents.filter(tweet => tweet.userId === user.$id);
        setTweets(userTweets);
      }
    };
    fetchData();
  }, [user, refreshKey]);

  const handleLogout = () => {
    profileDetails.logout();
    dispatch(logout());
  };

  const handleUpdateProfile = async () => {
    if (!username.trim()) return;
    let imageId = profile.profileImage;

    if (profileImgFile) {
      const uploaded = await profileDetails.uploadProfileImg(profileImgFile);
      imageId = uploaded?.$id || imageId;
    }

    const updatedProfile = await profileDetails.updateUserProfile(profile.$id, {
      username,
      bio,
      profileImage: imageId,
    });

    setProfile(updatedProfile);
    setEditMode(false);
    setRefreshKey(Date.now());

    if (updatedProfile?.profileImage) {
      const updatedImageURL = profileDetails.getFileURL(updatedProfile.profileImage);
      setImageURL(updatedImageURL);
    }
  };

  if (!profile) {
    return (
      <Container>
        <p className="text-center py-10 text-gray-400">Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-md bg-white mt-4">
        <div className="flex items-center gap-4 flex-wrap">
          {imageURL ? (
            <img src={imageURL} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-xl">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            {editMode ? (
              <input
                className="text-lg font-semibold text-gray-800 border border-gray-300 p-2 rounded-md w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : (
              <h2 className="text-lg font-semibold text-gray-800 break-all">{profile.username}</h2>
            )}
            <p className="text-sm text-gray-500 break-all">@{profile.userId}</p>
          </div>
        </div>

        <div className="mt-4">
          {editMode ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a bio..."
            />
          ) : (
            <p className="text-sm text-gray-700">{profile.bio}</p>
          )}
        </div>

        {editMode && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input type="file" onChange={(e) => setProfileImgFile(e.target.files[0])} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {editMode ? (
            <>
              <Button onClick={handleUpdateProfile} bgColor="bg-green-600">Save</Button>
              <Button onClick={() => setEditMode(false)} bgColor="bg-gray-500">Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)} bgColor="bg-blue-600">Edit Profile</Button>
          )}
          <Button onClick={handleLogout} bgColor="bg-red-500">Logout</Button>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-8 mb-24">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Your Tweets</h3>
        {tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard key={tweet.$id} $id={tweet.$id} forceUpdate={refreshKey} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">You haven't posted anything yet.</p>
        )}
      </div>
    </Container>
  );
}

export default ProfileInfo;
