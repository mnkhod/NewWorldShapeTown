import { useNavigate } from "react-router";
import { useEffect } from 'react'
import { ethers } from "ethers";

function Login() {
    let navigate = useNavigate();


    useEffect(() => {
        if(window.ethereum){
            if(window.ethereum.selectedAddress && window.ethereum.selectedAddress.length > 0){
                navigate("/game")
            }
        }
    }, [])

    async function openLogin(){
        if(window.ethereum){
            let provider = new ethers.BrowserProvider(window.ethereum)
            try {
                await provider.getSigner();
                navigate("/game")
            } catch (e) { }
        }else{
            alert("No Metamask Detected")
        }
    }

    return (
        <div className="">
            <img src="/assets/ShapeTownBg.png" className='absolute top-0 left-0 z-0 object-cover h-full w-full' />

            <div className='z-10 relative h-screen flex items-center ml-0'>
                <div className='relative'>
                    <img src="/assets/shapeTownSign.png" className='relative px-4 ' height={"920"} width={"705"} />
                    <button className='absolute bottom-1 px-16 left-0 w-full flex justify-center' onClick={() => { openLogin() }}>
                        <img src="/assets/loginConnect.png" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;