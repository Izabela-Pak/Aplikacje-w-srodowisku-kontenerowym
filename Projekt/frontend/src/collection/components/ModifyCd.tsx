import { useEffect, useState } from "react";
import type { ModifyData } from "../collection.types";
import { cdServices } from "../../services/collection.api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ModifyCD: React.FC<ModifyData> = ({editingCD, email}) => {

    //Pobranie obecnych informacji przed edycją CD
    const GetCdData = async () =>{
        try{
            const response = await cdServices.getSpecific(editingCD);
            setAuthor(response.data.author);
            setImage(response.data.image_link);
            setTitle(response.data.title);
            setYear(response.data.year); 
        }catch(error:unknown){
            console.log("Błąd pobrania CD", error);
        }
    }

    //Pobranie danych do danego CD
    useEffect(()=>{
        GetCdData();
    },[])

    //Potrzebne zmienne
    const navigate = useNavigate();
    const [author, setAuthor] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("year", year);
        formData.append("email", email);
        if (image) {
            formData.append("image", image);
        }

        await cdServices.modify(editingCD, formData);
        navigate("/collection"); 
    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 text-center">
            <div className="col bg-warning-subtle rounded-5 align-items-center container d-flex flex-column justify-content-center align-items-center border border-danger border-opacity-25 border-2" style={{ minWidth: "30vw", minHeight: "50vh" }}>
                <h4>Edytuj Album</h4>
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
                        <label htmlFor="formFile" className="form-label">Edytuj zdjęcie albumu</label>
                    </div>
                    <Link to="/collection" className="mb-2 mx-1 btn btn-dark btn-block" data-mdb-ripple-init >Wróć do strony głównej</Link>
                    <button data-mdb-ripple-init type="submit" className="mb-2 mx-1 btn btn-dark btn-block">Edytuj</button>
                </form>
            </div>
        </div>
    );
}

export default ModifyCD;