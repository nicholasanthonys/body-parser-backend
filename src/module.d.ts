// Put your env variable here to get strongly typed
declare namespace NodeJS {
    export interface ProcessEnv {
        DB_CONNECT:string 
        PORT:string
        ACCESS_TOKEN_SECRET:Secret        
        ACCESS_TOKEN_LIFE:string
        REFRESH_TOKEN_SECRET:Secret
        REFRESH_TOKEN_LIFE:Number
    }
}