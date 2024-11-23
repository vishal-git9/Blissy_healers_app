import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { serverLocalUrl,serverBaseUrl } from "../utils/globalVariable";
import { IRootState } from "../redux";

const baseQuery = fetchBaseQuery({
    baseUrl:serverBaseUrl,

    prepareHeaders(headers, {getState}) {
        const {Auth} = getState() as IRootState;
        console.log(Auth.token,"---auth state")
        if(Auth.token){
            headers.set('authorization',`Bearer ${Auth.token}`)
        }
        return headers
    },
})
export const API = createApi({
    reducerPath:"Api",
    baseQuery,
    endpoints:()=>({})
    
})
