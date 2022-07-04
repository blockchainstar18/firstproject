
import { useNavigate } from "react-router-dom";
const AboutUs = () => {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/`; 
        navigate(path);
    }

    return(
        <div>
            <button onClick={routeChange}>Back to Home</button>
            <h1>About us</h1>
            <p id = "paragraph">
            &nbsp;&nbsp;1. What is ZeroX Domains?<br/>
            ZeroX Domains is a naming service offering the TLD .0x, a fresh variant of what is already
            available for purchase.
            ZeroX Domains is based on the Ethereum blockchain, giving you total control of your data.<br/><br/>
            &nbsp;&nbsp;2. Availability<br/>
            Any domain can be bought without restriction on character length. Regardless of who you may
            be, you can purchase domains that have been restricted by other domain name providers, such
            as 1.0x and the likes. We believe that everyone should have the chance of purchasing
            something unique and special to them.
            Currently, only English letters and numbers are recognized. This will change as the company
            matures.<br/><br/>
            &nbsp;&nbsp;3. Why the TLD .0x?<br/>
            Well, it’s simple; every Ethereum-based wallet address begins with the same two characters in
            the same order: 0x!<br/><br/>
            &nbsp;&nbsp;4. The functionality…<br/>
            ZeroX Domains aims to provide all the functions that you typically get with other domain name
            providers and also introduce meaningful integrations so you can utilize your domain to the max.<br/><br/>
            &nbsp;&nbsp;5. Your domains<br/>
            Through this website, you can buy and sell your domains. The resell fee is capped at 1%.
            </p>
            <div className='footer'>
                <div id = "aboutus">Copyright © 2022 ZeroX Domains.<br/> All Rights Reserved.</div>
                <div id = "aboutus" onClick={routeChange} class = "aboutus">Home</div>
                <div id = "aboutus">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contact us&nbsp;&nbsp;&nbsp;
                    <a href = "https://twitter.com/ZeroxDomains" target="_blank" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#8090d1" class="bi bi-twitter" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                    </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AboutUs;