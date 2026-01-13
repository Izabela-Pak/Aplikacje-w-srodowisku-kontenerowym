
import VerifyUser from "../pages/VerifyUser";
import Login from "../pages/Login";
import Register from "../pages/Register";

const UserLayout = () => {

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 text-center">
            <div className="row gap-2 ">
                <div className="col bg-warning-subtle rounded-5 align-items-center container d-flex flex-column justify-content-center align-items-center border border-danger border-opacity-25 border-2" style={{ minWidth: "30vw", minHeight: "50vh" }}>
                    <h3>Zaloguj się</h3><br />
                    <Login/>
                </div>
                <div className="col align-items-center container d-flex justify-content-center">
                    <h1>Lub</h1>
                </div>
                <div className="col bg-warning-subtle rounded-5 align-items-center container d-flex flex-column justify-content-center align-items-center border border-danger border-opacity-25 border-2" style={{ minWidth: "30vw", minHeight: "50vh" }}>
                    <h4>Zarejestruj się już dziś</h4><br />
                    <Register/>
                </div>
                <div className="col bg-warning-subtle rounded-5 align-items-center container d-flex flex-column justify-content-center align-items-center border border-danger border-opacity-25 border-2" style={{ minWidth: "15vw", minHeight: "25vh" }}>
                    <h5>Zarejestrowałeś się? Potwierdź konto tutaj</h5><br />
                    <VerifyUser />
                </div>
            </div>
        </div>
    );

}

export default UserLayout;