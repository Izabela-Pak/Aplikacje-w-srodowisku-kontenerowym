import { useEffect, useState } from "react";
import { cdServices } from "../../services/collection.api";
import type { Cd } from "../collection.types";
import { getEmailFromToken } from "../../services/jwt";
import { Link } from "react-router";

const CdList = () => {

    const userEmail = getEmailFromToken();
    const [list, setList] = useState<Cd[]>([]);
    {/*const [editingCd, setEditingCd] = useState<Cd | null>(null); */}


    async function LoadCD(email: String): Promise<Cd[]> {
        const response = await cdServices.getAll(email);
        console.log(response.data);
        return response.data;
    }

    useEffect(() => {
        const load = async () => {
            if (!userEmail) return;
            const data = await LoadCD(userEmail);
            setList(data);
        };
        load();
    }, [userEmail]);

    // Usuwanie albumu
    const deleteCd = async (albumNumber:number) => {
      await cdServices.delete(albumNumber);
      if(userEmail){
        const data = await LoadCD(userEmail);
        setList(data);
      }
    };



       return (
            <div className="row g-3 pt-2 ">
            {/* Początek edycji pojedyńczego CD*/}
            {list.length === 0 ? (
                <b><p className="text-light text-center">Nie posiadasz jeszcze żadnych płyt</p></b>
            ) : (
                list.map(cd => (
                <div key={cd.id_album} className=" col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 card-background-color text-white">
                    <div className="row g-0">
                        
                        {cd.image_link && (
                        <div className="col-5" style={{ width: "180px", height: "180px", overflow: "hidden" }}>
                            <img
                            src={cd.image_link}
                            className="img-fluid rounded-start"
                            alt={cd.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                            />
                        </div>
                        )}

                        <div className="col">
                        <div className="card-body">
                            <h5 className="card-title">{cd.title}</h5>
                            <p className="card-text">{cd.author}</p>
                            <p className="card-text">
                            <small className="text-white-50">{cd.year}</small>
                            </p>
                            <div className="d-flex d-inline">
                                <Link
                                    to="/modify"
                                    state={{ fromCollection: true, editingCD: cd.id_album , email: userEmail}}
                                    className="card-link link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                >Modyfikuj</Link>
                                <a href="#" className="card-link link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"    onClick={async (e) => {
                                    e.preventDefault(); // blokuje przeładowanie strony
                                    await deleteCd(cd.id_album);
                                }}>Usuń</a>
                            </div>
                        </div>
                        </div>

                    </div>
                    </div>
                </div>
                ))
            )}
            {/* Koniec edycji pojedyńczego CD*/}
            </div>
    );

}

export default CdList;