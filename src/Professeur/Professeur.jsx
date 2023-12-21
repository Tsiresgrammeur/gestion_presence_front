import React, { useEffect, useState } from "react";
import api from '../api'
import "font-awesome/css/font-awesome.css";
import { toast } from 'react-toastify';
import { ModalBody, ModalFooter, ModalTitle, Form } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ModalDelete from "../template/ModalDelete";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from "react-router-dom";
function Professeur() {
    const initialState = {
        nom: "",
        prenom: "",
    }
    const [state, setState] = useState(initialState)
    const [filterText, setFilterText] = useState('');
    const {nom, prenom} = state;
    const [professeurs, setProfesseurs] = useState([]);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [numItem, setNumItem] = useState(1);
    const [showEdit, setShowEdit] = useState(false);
    const [id, setId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const navigate = useNavigate()

    const handleClose = () => {

        setState({ nom: "",prenom:""});
        setShow(false)
    };

    function getList() {
        api.get("/professeur").then(function (response) {
            setProfesseurs(response.data)
        });
    }


    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    useEffect(() => {
        getList();
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const closeEditModal = () => {
        setShowEdit(false);
    };

    function onClose() {
        closeEditModal();

    }

    useEffect(() =>{
        if(!localStorage.getItem('role'))
        {
            navigate('/')
        }
    })

    const showEditModal = (id) => {
        api.get("/professeur/" + id).then((res) => setState({ ...res.data }));
        setNumItem(id);
        setShowEdit(true);
    };


    const captureTable = () => {
        const table = document.getElementById('myTable');

        html2canvas(table, { allowTaint: true, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('table.pdf');
        });
    };

    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const showDeleteModal = (id) => {
        setId(id);
        setDeleteMessage(
            `Voulez-vous vraiment supprimer cette ligne?`
        );
        setDisplayConfirmationModal(true);
    };

    const deleteItem = (id) => {
        api.delete("/professeur/" + id).then(function (response) {
            setDisplayConfirmationModal(false);
            toast.success(`Suppression bien réussie`);
            getList();
        });

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nom) {
            toast.error("Complétez les champs!")
        }
        else {
            api.post('/professeur', {
                nom,
                prenom
            }).then(() => {
                setState({ nom: "", prenom:"" });
                handleClose();
                toast.success("Ajout avec succès!")
                getList();
            }).catch((err) => { handleClose(); toast.error(err.response.data) });
        }
    }
    const filteredData = professeurs.filter(item => {
        const values = Object.values(item).join('').toLowerCase();
        return values.includes(filterText.toLowerCase());
    });

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!nom) {
            toast.error("Complétez tous les champs")
        }
        else {
            api.put("/professeur/" + numItem, {
                nom,
                prenom
            }).then((response) => {
                if (response.status === 200) {
                    setState({ nom: "", prenom:"" });
                    toast.success("Modification avec succès")
                    getList();
                    onClose();
                }
                else {
                    toast.error("Il y a sûrement une erreur")
                }
            })
        }
    }

    return (
        <div>

             <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <ModalTitle className='text-center'>
                            <h5 className="card-title" style={{ fontFamily: "Century gothic", color: "#008cba", fontWeight: "bold" }}>Nouvelle professeur</h5><br />
                        </ModalTitle>

                        <input
                            type='text'
                            className='form-control'
                            id="nom"
                            name="nom"
                            placeholder="Nom"
                            value={nom}
                            onChange={handleInputChange} /><br />

                        <input
                            type='text'
                            className='form-control'
                            id="prenom"
                            name="prenom"
                            placeholder="Prénom"
                            value={prenom}
                            
                            onChange={handleInputChange} /><br />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='secondary' style={{ fontFamily: "Century gothic" }} onClick={handleClose}>
                            Fermer
                        </Button>

                        <Button type="submit" style={{ fontFamily: "Century gothic" }} variant='primary'>
                            Ajouter
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            <ModalDelete
                showModal={displayConfirmationModal}
                confirmModal={deleteItem}
                hideModal={hideConfirmationModal}
                id={id}
                message={deleteMessage}
            />



            <Modal
                size="md"
                show={showEdit}
                onHide={closeEditModal}
                backdrop="static"
                keyboard={false}
            >

                <ModalBody>
                    <ModalTitle className='text-center'>
                        <h5 className="card-title" style={{ fontFamily: "Century gothic", color: "#008cba", fontWeight: "bold" }}>Modification</h5><br />
                    </ModalTitle>
                    <form style={{
                        margin: "auto",
                        padding: "15px",
                        maxWidth: "450px",
                        fontFamily: "cambria",
                        fontSize: "13pt",
                        alignContent: "center"
                    }}
                        onSubmit={handleSubmitEdit}
                    >
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            placeholder="Nom de l'enseignant"
                            className="form-control"
                            value={nom || ""}
                            onChange={handleInputChange}
                        /><br />
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            placeholder="Nom de l'enseignant"
                            className="form-control"
                            value={prenom || ""}
                            onChange={handleInputChange}
                        /><br />

                        <ModalFooter>
                            <Button variant='secondary' style={{ fontFamily: "Century gothic" }} onClick={closeEditModal}>
                                Fermer
                            </Button>

                            <Button type="submit" style={{ fontFamily: "Century gothic" }} variant='success'>
                                Modifier
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </Modal>

            <div className="container">
                <div className='row mt-5'>
                    <div className='col btn-container' style={{display:'flex'}}>
                        <button className='btn btn-primary' id='btn_ajouter' onClick={handleShow}>
                            AJOUTER &nbsp; <i className='fa fa-plus'></i>
                        </button>

                        <button className='btn btn-secondary' onClick={captureTable}>
                            Générer PDF &nbsp; <i className='fa fa-file-pdf-o'></i>
                        </button>
                    </div>

                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Rechercher..."
                            value={filterText}
                            onChange={handleFilterChange}
                            className='form-control form-control-md'
                        />
                    </Form.Group>
                    <table id="myTable" class="table table-striped">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", width: "50px",}}>Nom</th>
                                <th style={{ textAlign: "center", width: "300px" }}>Prénom</th>
                                <th style={{ textAlign: "center", width: "150px" }}><i className="fa fa-cog"></i></th>
                            </tr>
                        </thead>
                        <tbody class="table-hover">
                            {professeurs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>Aucun donnée pour le moment...</td>
                                </tr>
                            ) : (
                                filteredData.map((professeur, index) => (
                                    <tr key={index}>
                                        <td>{professeur.nom}</td>
                                        <td style={{ textAlign: "center" }}>{professeur.prenom}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => showDeleteModal(professeur.id)}><i className="fa fa-trash"></i></button>

                                            <button className="btn btn-success" onClick={() => showEditModal(professeur.id)}><i className="fa fa-edit"></i></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
        </div>
    )
}

export default Professeur;