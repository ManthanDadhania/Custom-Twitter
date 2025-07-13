import conf from "../conf/conf"
import { Client, Databases, ID, Storage, Query } from "appwrite"

class ProfileDetails {
    client = new Client()
    database;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.database = new Databases(this.client)
        this.storage = new Storage(this.client)
    }

    async createUserProfile({ userId, username, bio, profileImage }) {
        try {
            return await this.database.createDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, userId, {
                userId,
                username,
                bio,
                profileImage,
            })
        } catch (error) {
            console.log("Error in ProfileServise :: Creating User Profile ", error)
        }
    }

    async getUserProfile(userId) {
        try {
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                [Query.equal("userId", userId)]
            );
            return res.documents.length > 0 ? res.documents[0] : null;
        } catch (error) {
            console.error("Error in ProfileService :: Getting User Profile", error);
            return null;
        }
    }

    async updateUserProfile(userId, { username, bio, profileImage }) {
        try {
            return await this.database.updateDocument(conf.appwriteDatabaseId, conf.appwriteProfileCollectionId, userId, {
                username,
                bio,
                profileImage,
            })
        } catch (error) {
            console.log("Error in ProfileService :: Updating User Profile", error)
        }
    }

    async uploadProfileImg(file) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch (error) {
            console.log("Error in ProfileServise :: Uploading File ", error)
        }
    }

    async deleteProfileImg(fileId) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileId)
        } catch (error) {
            console.log("Error in ProfileService :: Deleting File ", error)
        }
    }

    getFileURL(fileId) {
        try {
            const url = this.storage.getFileDownload(conf.appwriteBucketId, fileId);
            return typeof url === 'string' ? url : url?.href ?? '';

        } catch (error) {
            console.error("Error generating file preview URL", error);
        }
    }
    async getTopTweetUsers() {
        try {
            // Step 1: Fetch all tweets
            const tweetsRes = await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );

            // Step 2: Count tweets per userId
            const tweetCounts = {};
            tweetsRes.documents.forEach((tweet) => {
                const uid = tweet.userId;
                tweetCounts[uid] = (tweetCounts[uid] || 0) + 1;
            });

            // Step 3: Sort users by tweet count (descending)
            const topUserIds = Object.entries(tweetCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([userId]) => userId);

            // Step 4: Fetch profile for each userId using your getUserProfile()
            const profiles = await Promise.all(
                topUserIds.map(async (uid) => await this.getUserProfile(uid))
            );

            return profiles.filter(Boolean); // Remove nulls
        } catch (error) {
            console.error("Error in ProfileService :: Getting Top Tweet Users", error);
            return [];
        }
    }


}

const profileDetails = new ProfileDetails()
export default profileDetails;