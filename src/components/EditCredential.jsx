import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import "../css/Credentials.css";
import toast from "react-hot-toast";


function EditCredential(){

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [credential, setCredential] = useState({
        website:"",
        username:"",
        password:"",
        notes:""
    });


    useEffect(()=>{

        fetchCredential();

    },[]);


    const fetchCredential = async()=>{

        try{

            const response = await API.get(`/credentials/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });

            setCredential(response.data);

        }
        catch(error){

            console.log(error);

        }

    };


    const handleChange=(e)=>{

        setCredential({
            ...credential,
            [e.target.name]:e.target.value
        });

    };


    const updateCredential=async(e)=>{

        e.preventDefault();
         setLoading(true);

        try{

            await API.put(`/credentials/${id}`,credential,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });

            toast.success("Password updated successfully!");

setTimeout(() => {
    navigate("/credentials");
}, 1000);

        }
        catch(error){

            toast.error(
    error.response?.data || "Update failed."
);


        }
        finally{
            setLoading(false);
        }

    };


    return(

        <div className="credentials-page">

            <div className="credential-card">

                <h2>Edit Password</h2>


                <form onSubmit={updateCredential}>


                    <input
                    name="website"
                    value={credential.website}
                    onChange={handleChange}
                    placeholder="Website"
                    />


                    <input
                    name="username"
                    value={credential.username}
                    onChange={handleChange}
                    placeholder="Username"
                    />


                    <input
                    name="password"
                    value={credential.password}
                    onChange={handleChange}
                    placeholder="Password"
                    />


                    <textarea
                    name="notes"
                    value={credential.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    />


                    <button
    type="submit"
    disabled={loading}
>
    {loading ? "Updating..." : "Update Password"}
</button>

                </form>

            </div>

        </div>

    );

}


export default EditCredential;