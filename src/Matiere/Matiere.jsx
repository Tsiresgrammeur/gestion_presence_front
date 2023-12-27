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
import domtoimage from 'dom-to-image';
import { useNavigate } from "react-router-dom";

function Matiere() {
    const initialState = {
        libelle: "",
        classe_id: 0,
        professeur_id: 0
    }
    const [filterText, setFilterText] = useState('');
    const [state, setState] = useState(initialState)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const { libelle, classe_id, professeur_id } = state;
    const [matieres, setMatieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [professeurs, setProfesseurs] = useState([]);
    const [show, setShow] = useState(false);
    const [numItem, setNumItem] = useState(1);
    const [showEdit, setShowEdit] = useState(false);
    const [id, setId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const navigate = useNavigate()
    const handleClose = () => {

        setState({ libelle: "", classe_id: classes[0]?.id, professeur_id: 0 });
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };
    function getList() {
        api.get("/matiere").then(function (response) {
            setMatieres(response.data)
        });
    }

    const getClasse = () => {
        api.get("/classe").then(function (response) {
            setClasses(response.data)
        });


    }

    const getProfesseur = () => {
        api.get("/professeur").then(function (response) {
            setProfesseurs(response.data)
        });


    }

    useEffect(() => {
        if (classes) {
            setState({ ...state, classe_id: classes[0]?.id })
        }
    }, [classes])

    useEffect(() => {
        if (!localStorage.getItem('role')) {
            navigate('/')
        }
    })

    useEffect(() => {
        getList();
        getClasse();
        getProfesseur()
    }, [])

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        // Sort the data
        const sortedData = [...matieres].sort((a, b) => {
            if (direction === 'ascending') {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });

        setMatieres(sortedData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const closeEditModal = () => {
        setState({ libelle: "", classe_id: 0, professeur_id: 0 });
        setShowEdit(false);
    };

    function onClose() {
        closeEditModal();

    }

    const showEditModal = (id) => {
        api.get("/matiere/" + id).then((res) => setState({ ...res.data }));
        setNumItem(id);
        setShowEdit(true);
    };

    const captureTable = () => {
        const table = document.getElementById('myTable');
        domtoimage.toPng(table)
            .then(function (dataUrl) {
                const pdf = new jsPDF();
                pdf.addImage(dataUrl, 'PNG', 10, 10);
                pdf.save('table.pdf');
            })
            .catch(function (error) {
                console.error('Error capturing table:', error);
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
        api.delete("/matiere/" + id).then(function (response) {
            setDisplayConfirmationModal(false);
            toast.success(`Suppression bien réussie`);
            getList();
        });

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!libelle) {
            toast.error("Complétez les champs!")
        }
        else {
            api.post('/matiere', {
                libelle,
                classe_id,
                professeur_id
            }).then(() => {
                setState({ libelle: "", classe_id: 1, professeur_id: 1 });
                handleClose();
                toast.success("Ajout avec succès!")
                getList();
            }).catch((err) => { handleClose(); toast.error(err.response.data) });
        }
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!libelle) {
            toast.error("Complétez tous les champs")
        }
        else {
            api.put("/matiere/" + numItem, {
                libelle,
                classe_id,
                professeur_id
            }).then((response) => {
                if (response.status === 200) {
                    setState({ libelle: "", classe_id: 1, professeur_id: 1 });
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

    const filteredData = matieres.filter(item => {
        const values = Object.values(item).join('').toLowerCase();
        return values.includes(filterText.toLowerCase());
    });

    return (
        <div>

            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <ModalTitle className='text-center'>
                            <h5 className="card-title" style={{ fontFamily: "Century gothic", color: "#008cba", fontWeight: "bold" }}>Nouvelle matiere</h5><br />
                        </ModalTitle>

                        <input
                            type='text'
                            className='form-control'
                            id="libelle"
                            name="libelle"
                            placeholder="Libelle"
                            value={libelle}
                            onChange={handleInputChange} /><br />


                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='classe_id' value={classe_id} onChange={handleInputChange}>
                            {classes.map((classe) => (
                                <option key={classe.id} value={classe.id}>{classe.libelle}</option>
                            ))}
                        </select>

                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='professeur_id' value={professeur_id} onChange={handleInputChange}>
                            {professeurs.map((professeur) => (
                                <option key={professeur.id} value={professeur.id}>{professeur.nom} {professeur.prenom}</option>
                            ))}
                        </select>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='secondary' style={{ fontFamily: "Century gothic" }} onClick={handleClose}>
                            Fermer
                        </Button>

                        <Button type="submit" style={{ fontFamily: "Century gothic" }} variant='success'>
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
                            type='text'
                            className='form-control'
                            id="libelle"
                            name="libelle"
                            placeholder="Libelle"
                            value={libelle}
                            onChange={handleInputChange} /><br />


                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='classe_id' value={classe_id} onChange={handleInputChange}>
                            {classes.map((classe) => (
                                <option key={classe.id} value={classe.id}>{classe.libelle}</option>
                            ))}
                        </select>

                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='professeur_id' value={professeur_id} onChange={handleInputChange}>
                            {professeurs.map((professeur) => (
                                <option key={professeur.id} value={professeur.id}>{professeur.nom} {professeur.prenom}</option>
                            ))}
                        </select>

                        <ModalFooter>
                            <Button variant='secondary' style={{ fontFamily: "Century gothic" }} onClick={closeEditModal}>
                                Fermer
                            </Button>

                            <Button type="submit" style={{ fontFamily: "Century gothic" }} variant='primary'>
                                Modifier
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </Modal>

            <div className="container">
                <div className='row mt-5'>
                    <div className="col btn-container" style={{ display: 'flex' }}>

                        <button className='btn btn-success btn-lg' id='btn_ajouter' onClick={handleShow}>
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
                    <table id="myTable" className="table table-striped">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", width: "300px", }} onClick={() => requestSort('libelle')}>Nom de la matière</th>
                                <th style={{ textAlign: "center", width: "50px", }} onClick={() => requestSort('classe_libelle')}>Classe</th>
                                <th style={{ textAlign: "center", width: "300px" }} onClick={() => requestSort('nom')}>Nom du professeur</th>
                                <th style={{ textAlign: "center", width: "300px" }} onClick={() => requestSort('prenom')}>Prénom du professeur</th>
                                <th style={{ textAlign: "center", width: "150px" }}><i className="fa fa-cog"></i></th>
                            </tr>
                        </thead>
                        <tbody class="table-hover">
                            {matieres.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>Aucun donnée pour le moment...</td>
                                </tr>
                            ) : (
                                filteredData.map((matiere, index) => (
                                    <tr key={index}>
                                        <td>{matiere.libelle}</td>
                                        <td style={{ textAlign: "center" }}>{matiere.classe_libelle}</td>
                                        <td style={{ textAlign: "center" }}>{matiere.nom}</td>
                                        <td style={{ textAlign: "center" }}>{matiere.prenom}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => showDeleteModal(matiere.id)}><i className="fa fa-trash"></i></button>

                                            <button className="btn btn-primary" onClick={() => showEditModal(matiere.id)}><i className="fa fa-edit"></i></button>
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

export default Matiere;