//Opcjonalnie, Modify i Create połączyć w jedną stronę
import { genres } from "../collection.types";
import { Link, useNavigate } from "react-router-dom";
import { getEmailFromToken } from "../../services/jwt";
import { useState, useEffect } from "react";
import type {ModifyData} from "../collection.types";
import { cdServices } from "../../services/collection.api";

const EditingPage: React.FC<ModifyData> = ({editingCD}) => {

    //Potrzebne zmienne
    const email = getEmailFromToken();
    const navigate = useNavigate();
    const [author, setAuthor] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [file, setImage] = useState<File | null>(null);
    const [genre, setGenre] = useState<string>("Pop");
    const [genreOpcional, setGenreOptional] = useState<string | null>("");
    const [cdType, setCdType] = useState<string>("cd");

    //Pobranie danych do danego CD
    useEffect(()=>{
        if(editingCD){
            GetCdData();
        } 
    },[])

    //Pobranie obecnych informacji przed edycją CD
    const GetCdData = async () =>{
        try{
            if(editingCD){
                const response = await cdServices.getSpecific(editingCD);
            setAuthor(response.data.author);
            setImage(response.data.image_link);
            setTitle(response.data.title);
            setYear(response.data.year); 
            setGenre(response.data.genre_required);
            if(response.data.vinyl_or_cd)setCdType(response.data.vinyl_or_cd);
            console.log(response.data.genre_optional)
            setGenreOptional(response.data.genre_optional)
            }
            
        }catch(error:unknown){
            console.log("Błąd pobrania CD", error);
        }
    }

    const Validate = () => {
        //Czy wymagane wartości są poprawne
        if (!/^\d+$/.test(year)){
            return false;
        }

        const numberYear = Number(year);
        console.log(numberYear)
        if (numberYear < 1939 || numberYear > new Date().getFullYear()){
            return false;
        }

        if(!email || !year || !author || !title){
            return false;
        }

        return true;
    }

    //Ogarnianie Modify
    const handleSubmitModify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        if(Validate() && email){
            const formData = new FormData();
            formData.append("title", title);
            formData.append("author", author);
            formData.append("year", year);
            formData.append("email", email);
            formData.append("genre_required", genre);
            formData.append("cd_type", cdType);
            if(genreOpcional){
                formData.append("genre_optional", genreOpcional);
            }
            if (file) {
                formData.append("image", file);
            }
            if(editingCD){
                await cdServices.modify(editingCD, formData);
                navigate("/collection"); 
            }
        }else{
            form.classList.add("was-validated");
        }

    }

    //Ogarnianie Create
    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if(Validate() && email){
            const formData = new FormData();
            formData.append("title", title);
            formData.append("author", author);
            formData.append("year", year);
            formData.append("email", email);
            formData.append("genre_required", genre);
            formData.append("cd_type", cdType);
            if(genreOpcional){
                formData.append("genre_optional", genreOpcional);
            }
            if (file) {
                formData.append("image", file);
            }
            await cdServices.create(formData);
            navigate("/collection"); 
        }else{
                form.classList.add("was-validated");
        }

    }

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100 text-center mt-5 mt-sm-0">
            <div className="col bg-warning-subtle rounded-5 align-items-center container d-flex flex-column justify-content-center align-items-center border border-danger border-opacity-25 border-2" style={{ minWidth: "25vw", minHeight: "50vh" }}>
                <h4 className="pt-3">{editingCD ? "Edytuj Album" : "Dodaj nowy album"}</h4>
                <form onSubmit={(editingCD)? handleSubmitModify : handleSubmitCreate } className="needs-validation p-4 d-flex d-flex flex-column flex-md-row gap-3 gap-md-5 " noValidate>
                    <div className="w-75">
                        {/*Tytuł*/}
                        <div data-mdb-input-init className="form-outline mb-4 form-floating">
                            <div className="form-floating">
                                <input type="text" placeholder="Tytuł" id="albumTitle" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                                <label htmlFor="albumTitle">Tytuł</label>
                            </div>
                        </div>
                        {/*Autor*/}
                        <div data-mdb-input-init className="form-outline mb-4">
                            <div className="form-floating">
                                <input type="text" id="albumAuthor" placeholder="Autor" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} required/>
                                <label htmlFor="albumAuthor">Autor</label>
                            </div>
                        </div>
                        {/*Rok*/}
                        <div data-mdb-input-init className="form-outline mb-4">
                            <div className="form-floating">
                                <input type="number" placeholder="Rok wydania" min={1939} max={new Date().getFullYear()} id="albumYear" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} required/>
                                <label htmlFor="albumYear">Rok wydania</label>
                            </div>
                        </div>
                        {/*Wybór gatunków*/}
                        <select className="form-select form-select-sm my-2" value={genre} onChange={(e) => setGenre(e.target.value)}>
                            <option value="" disabled>Wybierz gatunek (wymagane)</option>
                            {genres.map((genre) => (
                                <option key={genre.value} value={genre.value}>
                                {genre.label}
                                </option>
                            ))}
                        </select>
                        <select className="form-select form-select-sm my-2" value={genreOpcional || ""} onChange={(e) => setGenreOptional(e.target.value)}>
                            <option value="" disabled>Wybierz opcjonalnie drugi gatunek</option>
                            {genres.map((genre) => (
                                <option key={genre.value} value={genre.value}>
                                {genre.label}
                                </option>
                            ))}
                        </select>
                        </div>
                        {/*Plik*/}
                        <div className="w-75 d-flex flex-column justify-content-center align-items-center">
                            <div className="mb-3 w-100">
                                <label htmlFor="formFile" className="form-label">Dodaj opcjonalnie zdjęcie albumu</label>
                                <input className="form-control" type="file" id="formFile" accept="image/*"  onChange={(e) => { const file = e.target.files?.[0] || null; setImage(file); }}/>
                            </div>
                            {/*Wybór rodzaju płyty*/}
                            <div className="d-flex">
                                <div className="form-check m-2">
                                    <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault1" value="vinyl" checked={cdType === "vinyl"} onChange={(e)=> setCdType(e.target.value)}  />
                                    <label className="form-check-label" htmlFor="radioDefault1">
                                        Płyta winylowa
                                    </label>
                                </div>
                                <div className="form-check m-2">
                                    <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault2" value="cd"  checked={cdType === "cd"} onChange={(e)=> setCdType(e.target.value)} />
                                    <label className="form-check-label" htmlFor="radioDefault2">
                                        Płyta CD
                                    </label>
                                </div>
                            </div>
                            {/*Przyciski*/}
                            <div className="d-flex mt-2">
                                <Link to="/collection" className="mb-2 mx-1 btn btn-dark btn-block " data-mdb-ripple-init >Wróć do strony głównej</Link>
                                <button data-mdb-ripple-init type="submit" className="mb-2 mx-1 btn btn-dark btn-block">Utwórz</button>
                            </div>
                        </div>
                </form>
            </div>
        </div>
    );
}

export default EditingPage;