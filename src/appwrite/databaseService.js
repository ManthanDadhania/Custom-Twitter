import conf from "../conf/conf";
import { Client, ID, Storage, Databases, Query } from "appwrite";

class DatabaseService {
    client = new Client();
    database;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.database = new Databases(this.client)
        this.storage = new Storage(this.client)
    }

    async createPost({ title, images, userId, status, docId }) {
        try {
            return await this.database.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, docId, {
                title,
                images,
                userId,
                status,
            })
        } catch (error) {
            console.log("Error in DatabseServise :: Creating Post ", error)
        }
    }

    async updatePost(docId, { title, images, userId, status }) {
        try {
            return await this.database.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, docId, {
                title,
                images,
                userId,
                status,
            })
        } catch (error) {
            console.log("Error in DatabseServise :: Updating Post ", error)
        }
    }

    async deletePost(docId) {
        try {
            return await this.database.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, docId)
        } catch (error) {
            console.log("Error in DatabseServise :: Deleting Post ", error)
        }
    }

    async getPost(docId) {
        try {
            return await this.database.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, docId)
        } catch (error) {
            console.log("Error in DatabseServise :: Fetching Post ", error)
            return false;
        }
    }

   async getPosts() {
  try {
    return await this.database.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [
        Query.equal("status", "active"),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );
  } catch (error) {
    console.log("Error in DatabaseService :: Fetching all Posts", error);
    return false;
  }
}


    async uploadFile(file) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch (error) {
            console.log("Error in DatabseServise :: Uploading File ", error)
        }
    }

    async deleteFile(fileId) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileId)
        } catch (error) {
            console.log("Error in DatabaseService :: Deleting File ", error)
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
}

const databaseService = new DatabaseService()
export default databaseService;