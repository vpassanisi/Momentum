import bcrypt from "bcryptjs"
import type {values} from "faunadb"
import { registerBody } from "../util/reqValidator"


export class NewUser {
    name: string
    email: string
    password: string
    createdAt: number
    lastLogin: number
    constructor(userObj: registerBody) {
        this.name = userObj.name,
        this.email = userObj.email,
        this.password = userObj.password
        this.createdAt = Math.trunc(Date.now() / 1000)
        this.lastLogin = Math.trunc(Date.now() / 1000)
    }

    /**
    * encrypt the user password
    */
    async encrypt(rounds: number) {
        const salt = await bcrypt.genSalt(rounds);
        const encrypted = await bcrypt.hash(this.password, salt);
        this.password = encrypted
    }

    /**
     * get an object of the users information for adding to db
     */
    getUser() {
        return {
            name: this.name,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            lastLogin: this.lastLogin
        }
    }
}

export class FaunaUserRes extends NewUser {
    _id: string
    constructor(dbRes: values.Document<registerBody>){
        super(dbRes.data)  
        this._id = dbRes.ref.id
    }

    /**
     * return the object for responding the the graphql query
     */
    userResponse() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt
        }
    }
}