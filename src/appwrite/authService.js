import conf from '../conf/conf'
import {Client,Account,ID} from 'appwrite'
 
export class AuthServices{
    client=new Client()
    account

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.account=new Account(this.client)
    }

    async createAccount({email,password,name}){
        try {
            const userAccount=await this.account.create(ID.unique(),email,password,name)
            if(userAccount){
                return this.login({email,password})
            }
            else{
                return userAccount;
            }
        } catch (error) {
            console.log("Error in AuthServices :: createAccount ",error)
        }
    }
    async login({email,password}){
        try {
           return await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            console.log("Error in AuthServices :: Login ",error)
        }
    }
    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Error in AuthServices :: Fetching User Details ",error)
        }
    }
    async logout(){
        try{
            return await this.account.deleteSessions()
        } catch(error){
            console.log("Error in AuthServices :: Logout ",error)
        }
    }
}
const authService=new AuthServices()
export default authService;