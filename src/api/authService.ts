import {API} from "./Api"


interface loginInterface {
    email:string;
    otp?:number;
    
}


export const AuthApi = API.injectEndpoints({
    endpoints:(builder)=>({
        getOtp:builder.mutation<loginInterface,Partial<loginInterface>>({
            query:(body)=>({
                url:"auth/otp/generate",
                method:'POST',
                body
            })
        }),
        verifyOtp:builder.mutation<any,Partial<loginInterface>>({
            query:(body)=>({
                url:"auth/otp/verify",
                method:'POST',
                body
            })
        }),
        logoutUserSession:builder.mutation<any,Partial<loginInterface>>({
            query:()=>({
                url:"auth/logout",
                method:'POST',
                
            })
        }),
    })
})

export const {useGetOtpMutation,useVerifyOtpMutation,useLogoutUserSessionMutation} = AuthApi