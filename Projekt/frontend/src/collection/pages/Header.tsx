import logo from "../../assets/logo.png"
import { getEmailFromToken } from "../../services/jwt";
import { useEffect, useState } from "react";
import { userServices } from "../../services/auth.api";
import { Link } from "react-router";

const Header = () => {

    //Pobieranie danych użytkownika i przywitanie się z nim
    const [username, setUsername] = useState("");
    useEffect( () => {
    const fetchData = async () => {
        const email = getEmailFromToken();
        console.log(email);
        if(email){
        const formData = new FormData();
        formData.append("email", email);
        const response = await userServices.userDetails(formData);
        console.log(response.data);
        setUsername(response.data.name);
        }else{
            console.log("Nie znaleziono użytkownika")
        }
    }

    fetchData();
    }, []);

    //Widok interfejsu użytkownika
    return(
        <div className="header-collection row g-0 ">
                <div className="col d-flex d-inline align-items-center">
                    <img src={logo} alt="logo"  style={{ width: "60px", height: "60px", maxWidth: "100%" }} />
                    <h6 className="text-logo pt-3 fw-bold text-light text-uppercase">Płytoteka</h6>
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <Link to="/create" className=" text-decoration-none fw-semibold link-to-create-cd" data-mdb-ripple-init >Dodaj nowy album</Link>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <h4 className="pe-4 text-light">Witaj <i>{username}</i>!</h4>
                </div>
        </div>
    );

}

export default Header;