import { FaBlogger, FaLinkedin} from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import logo from '../assets/logo.png'

function Header() {
  return (
    <>
    <nav className="flex s items-center align-middle justify-between py-6">
        <div className="flex  flex-shrink-0 items-center">
            <a href="/">
            <img width='100' src={logo} alt="" />
            </a>
        </div>

    <div className="flex  gap-5">
       {/* <a href="https://www.facebook.com/bipin.shrestha.7545/" target="_blank"> <FaFacebook /> </a> */}
       <a href="https://www.linkedin.com/in/bipin-shrestha-4baba01a0/" target="_blank"> <FaLinkedin /> </a>
       {/* <a href="https://www.instagram.com/bipin.shrestha.07/" target="_blank"> <FaInstagramSquare /></a> */}
        <a href="https://github.com/bipinstha07" target="_blank"><FaGithub /></a>
        <a href="/blog"> <FaBlogger /> </a>
       
    </div>


    </nav>
    </>
  )
}

export default Header
