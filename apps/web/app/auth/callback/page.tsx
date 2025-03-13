import { onAuthenticateUser } from "actions/user";
import { redirect } from "next/navigation";


export default async function AuthCallback(){
    const res = await onAuthenticateUser()
    if(res.status === 200 || res.status === 201){
        return redirect("/trainModel")
    }
    
    return redirect("/sign-in")
}