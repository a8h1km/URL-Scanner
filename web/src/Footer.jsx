import logo from "./assets/github_PNG58.png"

function Footer() {
    return (
        < div className="p-20 bg-[#181818]  font-mono" >
            <br /><br /><br /><br /><br /><br /><br />
            <p className="text-center pb-6 text-white">Credits</p>
            <div className="flex flex-row justify-center">
                <div className="bg-white font-black rounded-xl rounded-r-none">
                    <p className="text-center">a8h1km</p>
                    <a href="https://github.com/a8h1km" target="_blank" rel="noopener noreferrer"><img src={logo} alt="github_logo" width={100} /></a>
                </div>
                <div className="text-center bg-white font-black rounded-xl rounded-l-none">
                    <p className="">Harsh</p>
                    <a href="https://github.com/HARSHPANWAR0406" target="_blank" rel="noopener noreferrer"><img src={logo} alt="github_logo" width={100} /></a>
                </div>
            </div>
        </div >
    )
}

export default Footer