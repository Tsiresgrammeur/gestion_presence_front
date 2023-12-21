import React, { useEffect, useState } from "react";
import api from '../api'
import "font-awesome/css/font-awesome.css";
import { toast } from 'react-toastify';
import { ModalBody, ModalFooter, ModalTitle, Form } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ModalDelete from "../template/ModalDelete";
import './style.css'
import './idCard.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import download from './download.png'
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import domtoimage from 'dom-to-image';
import html2pdf from 'html2pdf.js'

function Eleve() {
    const initialState = {
        nom: "",
        prenom: "",
        classe_id: 1,
        photo: "",
        libelle: ""
    }
    const [filterText, setFilterText] = useState('');
    const [state, setState] = useState(initialState)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const { nom, prenom, classe_id, libelle, photo } = state;
    const [eleves, setEleves] = useState([]);
    const [classes, setClasses] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setState({ nom: "", prenom: "", classe_id: classes[0]?.id, libelle: "" });
        setShow(false)
    };
    const handleShow = () => setShow(true);
    const [numItem, setNumItem] = useState(1);
    const [showEdit, setShowEdit] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [id, setId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const navigate = useNavigate()

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };
    function getList() {
        api.get("/eleve").then(function (response) {
            setEleves(response.data)
        });
    }

    const getClasse = () => {
        api.get("/classe").then(function (response) {
            setClasses(response.data)
        });


    }

    const generateQrCode = async (id) => {
        try {
            const response = await QRCode.toDataURL(String(id))
            setImageUrl(response)

        } catch (error) {
            console.error(error)
        }
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
    }, [])

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        // Sort the data
        const sortedData = [...eleves].sort((a, b) => {
            if (direction === 'ascending') {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });

        setEleves(sortedData);
    };
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photo") {
            setState((prevState) => ({
                ...prevState,
                [name]: { file: files[0], filename: "" },
            }), () => {
                console.log(state.photo); // Log the updated value in the callback
            });
        } else {
            setState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const closeEditModal = () => {
        setState({ nom: "", prenom: "", classe_id: classes[0]?.id, libelle: "" });
        setShowEdit(false);
    };

    function onClose() {
        closeEditModal();

    }

    const showEditModal = (id) => {
        api.get("/eleve/" + id).then((res) => setState({ ...res.data }));
        setNumItem(id);
        setShowEdit(true);
    };

    const showCardModal = async (id) => {
        api.get("/eleve/" + id).then(async (res) => {
            console.log("res", res.data)
            await setState({ ...res.data })
        });
        console.log("state", state);
        console.log("uploads", `/uploads/${photo}`);
        await generateQrCode(id);
        setShowCard(true);
    }


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
        api.delete("/eleve/" + id).then(function (response) {
            setDisplayConfirmationModal(false);
            toast.success(`Suppression bien réussie`);
            getList();
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nom) {
            toast.error("Complétez les champs!");
        } else {
            try {
                const formData = new FormData();
                formData.append("file", state.photo.file);
                const { data: { filename } } = await api.post("/upload", formData);

                await api.post('/eleve', {
                    nom,
                    prenom,
                    classe_id,
                    photo: { filename, originalname: state.photo.file.name },
                });

                setState({ nom: "", prenom: "", classe_id: 1, photo: null });
                handleClose();
                toast.success("Ajout avec succès!");
                getList();
            } catch (err) {
                handleClose();
                toast.error(err.response.data);
            }
        }
    };

    const cloneTableWithStyles = (originalTable) => {
        const clonedTable = document.createElement('table');
        const computedStyles = window.getComputedStyle(originalTable);
    
        // Apply computed styles to the cloned table
        Array.from(computedStyles).forEach((styleName) => {
            clonedTable.style[styleName] = computedStyles[styleName];
        });
    
        const originalRows = originalTable.querySelectorAll('tr');
        originalRows.forEach((originalRow) => {
            const clonedRow = document.createElement('tr');
            const originalCells = originalRow.querySelectorAll('td');
    
            originalCells.forEach((originalCell) => {
                const clonedCell = document.createElement('td');
                clonedCell.textContent = originalCell.textContent;
                clonedRow.appendChild(clonedCell);
            });
    
            clonedTable.appendChild(clonedRow);
        });
    
        return clonedTable;
    };
    
    // Example usage

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


    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!nom) {
            toast.error("Complétez tous les champs")
        }
        else {
            api.put("/eleve/" + numItem, {
                nom,
                prenom,
                classe_id
            }).then((response) => {
                if (response.status === 200) {
                    setState({ nom: "", prenom: "" });
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

    const filteredData = eleves.filter(item => {
        const values = Object.values(item).join('').toLowerCase();
        return values.includes(filterText.toLowerCase());
    });

    return (
        <div>

            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <ModalTitle className='text-center'>
                            <h5 className="card-title" style={{ fontFamily: "Century gothic", color: "#008cba", fontWeight: "bold" }}>Nouvelle eleve</h5><br />
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

                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='classe_id' value={classe_id} onChange={handleInputChange}>
                            {classes.map((classe) => (
                                <option key={classe.id} value={classe.id}>{classe.libelle}</option>
                            ))}
                        </select>
                        <input type="file" name="photo" onChange={handleInputChange} />
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

                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='classe_id' value={classe_id} onChange={handleInputChange}>
                            {classes.map((classe) => (
                                <option key={classe.id} value={classe.id}>{classe.libelle}</option>
                            ))}
                        </select>

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

            <Modal
                size="md"
                show={showCard}
                onHide={closeEditModal}
                backdrop="static"
                keyboard={false}
            >
                <ModalBody>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowCard(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>

                    <div className="container-card">
                        <div className="padding">
                            <div className="font">
                                <div className="top">
                                    <img src={`${api.defaults.baseURL}/uploads/${photo}`} />
                                </div>
                                <div className="bottom">
                                    <p>{nom} {prenom}</p>
                                    <p className="desi">{libelle}</p>
                                    <div className="barcode">
                                        <a href={imageUrl} download><img src={imageUrl} /></a>
                                    </div>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>

            </Modal>

            <div className="container">
                <div className='row mt-5'>
                    <div className="col btn-container" style={{ display: 'flex' }}>

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
                    <table id="myTable" className="table table-striped">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", width: "50px", }} onClick={() => requestSort('nom')}>Nom</th>
                                <th style={{ textAlign: "center", width: "300px" }} onClick={() => requestSort('prenom')}>Prénom</th>
                                <th style={{ textAlign: "center", width: "50px" }} onClick={() => requestSort('libelle')}>Classe</th>
                                <th style={{ textAlign: "center", width: "150px" }}><i className="fa fa-cog"></i></th>
                            </tr>
                        </thead>
                        <tbody className="table-hover">
                            {eleves.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>Aucun donnée pour le moment...</td>
                                </tr>
                            ) : (
                                filteredData.map((eleve, index) => (
                                    <tr key={index}>
                                        <td>{eleve.nom}</td>
                                        <td style={{ textAlign: "center" }}>{eleve.prenom}</td>
                                        <td style={{ textAlign: "center" }}>{eleve.libelle}</td>
                                        <td>
                                            <button className="btn btn-info" onClick={() => showCardModal(eleve.id)}><i className="fa fa-id-card-o"></i></button>
                                            <button className="btn btn-danger" onClick={() => showDeleteModal(eleve.id)}><i className="fa fa-trash"></i></button>

                                            <button className="btn btn-success" onClick={() => showEditModal(eleve.id)}><i className="fa fa-edit"></i></button>
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

export default Eleve;