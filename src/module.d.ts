// Put your env variable here to get strongly typed
declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV : string
        DB_CONNECT:string 
        PORT:string
        ACCESS_TOKEN_SECRET:Secret        
        ACCESS_TOKEN_LIFE:string
        REFRESH_TOKEN_SECRET:Secret
        REFRESH_TOKEN_LIFE:Number
        DOCKERFILE_DIR : string
        DOCKER_NETWORK_NAME : string
        DOCKER_CONTAINER_VOLUME_MOUNTPOINT : string
        TMP_PATH : string
        SINGLE_MIDDLEWARE_IMAGE_NAME : string
        
    }
}