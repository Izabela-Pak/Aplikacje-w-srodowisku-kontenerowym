import { useState } from "react";
import { cdServices } from "../../services/collection.api";
import { getEmailFromToken } from "../../services/jwt";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CreateCD = () => {
    //Potrzebne zmienne
    const email = getEmailFromToken();
    const navigate = useNavigate();
    const [author, setAuthor] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [file, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        if(email){
            form.append("email", email);
            form.append("author", author);
            form.append("title", title);
            form.append("year", year);
            if(file){
                form.append("file", file);
            }
            await cdServices.create(form);
            navigate("/collection"); 
        }else{
            console.log("Bląd, nie wykryto użytkownika");
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 text-center">
            <div className="col bg-warning-subtle rounded-5 align-items-center container d-flex flex-column justify-content-center align-items-center border border-danger border-opacity-25 border-2" style={{ minWidth: "30vw", minHeight: "50vh" }}>
                <h4 className="p-3">Dodaj nowy album</h4>
                <form onSubmit={handleSubmit}>
                    {/*Tytuł*/}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <input type="text" id="albumTitle" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <label className="form-label" htmlFor="albumTitle">Tytuł</label>
                    </div>
                    {/*Autor*/}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <input type="text" id="albumAuthor" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)}/>
                        <label className="form-label" htmlFor="albumAuthor">Autor</label>
                    </div>
                    {/*Rok*/}
                      <div data-mdb-input-init className="form-outline mb-4">
                        <input type="number" min={1939} max={new Date().getFullYear()} id="albumYear" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} required/>
                        <label className="form-label" htmlFor="albumYear">Rok wydania</label>
                    </div>
                    {/*Plik*/}
                    <div className="mb-3">
                        <input className="form-control" type="file" id="formFile"  onChange={(e) => { const file = e.target.files?.[0] || null; setImage(file); }}/>
                        <label htmlFor="formFile" className="form-label">Dodaj opcjonalnie zdjęcie albumu</label>
                    </div>
                    <Link to="/collection" className="mb-2 mx-1 btn btn-dark btn-block" data-mdb-ripple-init >Wróć do strony głównej</Link>
                    <button data-mdb-ripple-init type="submit" className="mb-2 mx-1 btn btn-dark btn-block">Utwórz</button>
                </form>
            </div>
        </div>
    );
}

export default CreateCD;