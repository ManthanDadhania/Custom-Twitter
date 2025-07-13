import React, { useEffect, useState } from 'react';
import Container from '../Container/Container';
import profileDetails from '../../appwrite/profileService';
import { useForm } from 'react-hook-form';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import { useSelector } from 'react-redux';
import databaseService from '../../appwrite/databaseService';
import { ID } from 'appwrite';
import { useNavigate } from 'react-router-dom';

function TweetForm({ tweet }) {
  const { register, handleSubmit, reset } = useForm();
  const { userData, status } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (status && userData?.$id) {
        try {
          const result = await profileDetails.getUserProfile(userData.$id);
          setProfile(result);
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      }
    };
    fetchProfile();
  }, [status, userData]);

  const submit = async (data) => {
    try {
      if (!status || !userData?.$id) return;

      let imageId = null;
      if (data.tweetImg && data.tweetImg[0]) {
        const uploaded = await databaseService.uploadFile(data.tweetImg[0]);
        imageId = uploaded?.$id || null;
      }

      const tweetData = {
        title: data.text,
        images: imageId,
        userId: userData.$id,
        status: data.status,
      };

      if (tweet) {
        await databaseService.updatePost(tweet.$id, tweetData);
      } else {
        await databaseService.createPost({
          ...tweetData,
          docId: ID.unique(),
        });
      }

      reset();
      navigate('/home');
    } catch (error) {
      console.error("Error submitting tweet:", error);
    }
  };

  if (!status || !userData) {
    return (
      <Container>
        <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500">
          You must be logged in to post a tweet.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="p-6 border border-gray-300 bg-white shadow-md rounded-xl w-full max-w-xl mx-auto mt-10">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            {profile?.profileImage ? (
              <img
                src={profileDetails.getFileURL(profile.profileImage)}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-lg">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <textarea
              name="text"
              id="text"
              placeholder="What's happening?"
              {...register("text", { required: true })}
              className="w-full resize-none p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm min-h-[100px]"
            />
          </div>

          <Input
            label="Tweet Image"
            placeholder="Choose an image"
            type="file"
            {...register("tweetImg")}
          />

          <Select
            options={['active', 'inactive']}
            label="Status"
            className="mb-4"
            {...register("status", { required: true })}
          />

          <Button type="submit" bgColor={tweet ? "bg-black" : undefined} className="w-full">
            {tweet ? "Update" : "Tweet"}
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default TweetForm;
