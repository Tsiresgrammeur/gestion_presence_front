import React, { useEffect, useState, useRef } from "react";
import api from '../api'
import "font-awesome/css/font-awesome.css";
import { toast } from 'react-toastify';
import { ModalBody, ModalFooter, ModalTitle, Form } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ModalDelete from "../template/ModalDelete";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import jsQR from 'jsqr';
import QRCode from "qrcode";
import domtoimage from 'dom-to-image';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from "react-router-dom";

function Presence() {
    const initialState = {
        id_matiere: 0,
        id_eleve: 0,
        classe_id: 0
    }
    const [filterText, setFilterText] = useState('');
    const [state, setState] = useState(initialState)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const { id_matiere, id_eleve, classe_id } = state;
    const [presences, setPresences] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [elevesFiltered, setEleveFiltered] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [numItem, setNumItem] = useState(1);
    const [showEdit, setShowEdit] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [id, setId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [qrCodeData, setQRCodeData] = useState('');
    const navigate = useNavigate()

    const qrRef = useRef(null);
    const fileInputRef = useRef(null);


    const onScanSuccess = (result) => {
        if (result) {

            setScanResult(result);
            // You can handle the scanned result here, for example, send it to an API or perform some action.
            console.log(scanResult);
        }
    };

    const onScanError = (error) => {
        console.error('Scan error:', error);
        // Handle scan errors here
    };


    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    useEffect(() => {
        // This effect will run whenever qrCodeData changes
        setState((prevState) => ({ ...prevState, id_eleve: +qrCodeData }));
    }, [qrCodeData]);


    useEffect(() => {
        // This effect will run whenever qrCodeData changes
        if (scanResult) {

            setState((prevState) => ({ ...prevState, id_eleve: +scanResult }));

        }
    }, [scanResult]);

    useEffect(() => {
        if (state.id_eleve)
            handleSubmit();
    }, [state.id_eleve])


    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            try {
                const imageData = await readFile(file);
                const qrCodeResult = jsQR(imageData.data, imageData.width, imageData.height);

                if (qrCodeResult) {
                    setQRCodeData(qrCodeResult.data);
                } else {
                    alert('No QR code found in the image.');
                }
            } catch (error) {
                console.error('Error reading file:', error);
                alert('Error reading file. Please try again.');
            }
        }
    };

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    const imageData = ctx.getImageData(0, 0, img.width, img.height);

                    resolve(imageData);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    };


    useEffect(() => {
        if (qrRef.current) {
            // Set the file input reference when it's available
            qrRef.current.setFileInput(fileInputRef.current);
        }
    }, []);

    const onScan = () => {
        qrRef.current.openImageDialog();
    }


    const handleUploadButtonClick = () => {
        // Trigger a click event on the file input
        fileInputRef.current.click();
    };
    function getList() {
        api.get("/presence").then(function (response) {
            setPresences(response.data)
        });
    }

    const getMatiere = () => {
        api.get("/matiere").then(function (response) {
            setMatieres(response.data)
        });

    }

    const onFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                setScanResult(imageDataUrl);
            };
            reader.readAsDataURL(file);
        }
    };




    const generateQRCodeImage = async () => {
        const response = await QRCode.toDataURL('1');
        setImageUrl(response);
    };

    const decodeBase64Image = (dataUrl) => {
        const base64Part = dataUrl.split(';base64,')[1];
        const decodedString = atob(base64Part);

        // Use jsQR library to decode the QR code
        const code = jsQR(decodedString);

        if (code) {
            console.log('Decoded QR Code Result:', code.data);
            setScanResult(code.data);
        } else {
            console.error('Unable to decode QR Code');
        }
    };


    const handleError = (error) => {
        console.log(error)
    }

    const handleScan = (result) => {
        if (result) {
            setScanResult(result)
        }
    }


    useEffect(() => {
        getList();
        getMatiere();
    }, [])


    useEffect(() => {
        if (matieres) {
            setState({ ...state, id_matiere: matieres[0]?.id })
        }
    }, [matieres])

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        // Sort the data
        if (presences) {
            const sortedData = [...presences].sort((a, b) => {
                if (direction === 'ascending') {
                    return a[key] > b[key] ? 1 : -1;
                } else {
                    return a[key] < b[key] ? 1 : -1;
                }
            });

            setPresences(sortedData);
        }
    };

    useEffect(() => {
        if (state.classe_id != 0) {
            console.log("eleve", state.classe_id)
            getEleveByClasse(state.classe_id)
            console.log("byClasse", elevesFiltered);
        }
    }, [state.classe_id])

    useEffect(() => {
        // Assuming 'id_matiere' is a string, convert it to integer for comparison
        const selectedMatiereId = parseInt(state.id_matiere);
        const currentMatiere = matieres.find(item => item.id === selectedMatiereId);

        if (currentMatiere) {
            console.log(currentMatiere);
            setState(prevState => ({ ...prevState, classe_id: currentMatiere.classe_id }));
        }
    }, [state.id_matiere, matieres]);

    const getEleveByClasse = (id) => {
        api.get("/eleve/classe/" + id).then(function (response) {
            setEleveFiltered(response.data)
        });
    }
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

    const showEditModal = (id) => {
        api.get("/presence/" + id).then((res) => setState({ ...res.data }));
        setNumItem(id);
        setShowEdit(true);
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
        api.delete("/presence/" + id).then(function (response) {
            setDisplayConfirmationModal(false);
            toast.success(`Suppression bien réussie`);
            getList();
        });

    };

    useEffect(() => {
        if (!localStorage.getItem('role')) {
            navigate('/')
        }
    })

    const handleSubmit = () => {
        if (!id_eleve || !id_matiere) {
            toast.error("Ce Qr code n'est pas celle d'un élève")
        }
        else {
            api.post('/presence', {
                id_eleve,
                id_matiere,
                status: "présent"
            }).then(() => {
                setState({ ...state, id_matiere: matieres[0]?.id })
                toast.success("Ajout avec succès!")
                handleDeleteStudent(id_eleve);
                getList();
            }).catch((err) => { handleClose(); toast.error(err.response.data) });
        }
    }

    const handleFinishSubmit = () => {
        if (elevesFiltered) {
            api.post('/absence', {
                eleves: elevesFiltered,
                id_matiere
            }).then(() => {
                setState({ ...state, id_matiere: matieres[0]?.id })
                toast.success("Ajout avec succès!")
                handleClose();
                getList();
            }).catch((err) => { handleClose(); toast.error(err.response.data) });
        }
    }

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
        if (!id_eleve) {
            toast.error("Complétez tous les champs")
        }
        else {
            api.put("/presence/" + numItem, {
                id_eleve,
                id_matiere
            }).then((response) => {
                if (response.status === 200) {
                    setState({ id_eleve: 0, id_matiere: 0 });
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

    const handleDeleteStudent = (idToDelete) => {
        const updatedStudents = elevesFiltered.filter((student) => student.id !== idToDelete);
        setEleveFiltered(updatedStudents);
    };

    const filteredData = presences.filter(item => {
        const values = Object.values(item).join('').toLowerCase();
        return values.includes(filterText.toLowerCase());
    });

    return (
        <div>

            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <ModalTitle className='text-center'>
                            <h5 className="card-title" style={{ fontFamily: "Century gothic", color: "#008cba", fontWeight: "bold" }}>Nouvelle presence</h5><br />
                        </ModalTitle>


                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='id_matiere' value={id_matiere} onChange={handleInputChange}>
                            {matieres.map((matiere) => (
                                <option key={matiere.id} value={matiere.id}>{matiere.libelle} {matiere.classe_id}</option>
                            ))}
                        </select>

                        <div className="qrReader" style={{ height: '50%' }}>
                            {/* <input type="file" accept="image/*" onChange={handleFileChange} />  */}
                            <QrReader
                                onResult={(result, error) => {
                                    if (!!result) {
                                        setScanResult(result?.text);

                                    }
                                    if (!!error) {
                                        console.info(error);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />

                            <p>{scanResult}</p>
                            <p>{id_eleve}</p>
                            {qrCodeData && <p>QR Code Data: {qrCodeData}</p>}
                            {qrCodeData && <p>Eleve: {id_eleve}</p>}
                        </div>


                    </ModalBody>

                    <ModalFooter>
                        <Button variant='secondary' style={{ fontFamily: "Century gothic" }} onClick={handleClose}>
                            Fermer
                        </Button>

                        <Button type="submit" style={{ fontFamily: "Century gothic" }} variant='primary'>
                            Ajouter
                        </Button>

                        <Button style={{ fontFamily: "Century gothic" }} variant='warning' onClick={handleFinishSubmit}>
                            Finir
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

                        <select className="form-select form-select-lg mb-3" aria-label="Classe" style={{ width: '100%' }}
                            name='id_matiere' value={id_matiere} onChange={handleInputChange}>
                            {matieres.map((matiere) => (
                                <option key={matiere.id} value={matiere.id}>{matiere.libelle}</option>
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
                                <th style={{ textAlign: "center", width: "50px", }} onClick={() => requestSort('libelle')}>Matière</th>
                                <th style={{ textAlign: "center", width: "50px" }} onClick={() => requestSort('classe_libelle')}>Classe</th>
                                <th style={{ textAlign: "center", width: "50px" }} onClick={() => requestSort('status')}>Status</th>
                                <th style={{ textAlign: "center", width: "150px" }}><i className="fa fa-cog"></i></th>
                            </tr>
                        </thead>
                        <tbody className="table-hover">
                            {presences.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>Aucun donnée pour le moment...</td>
                                </tr>
                            ) : (
                                filteredData.map((presence, index) => (
                                    <tr key={index}>
                                        <td>{presence.nom}</td>
                                        <td style={{ textAlign: "center" }}>{presence.prenom}</td>
                                        <td style={{ textAlign: "center" }}>{presence.libelle}</td>
                                        <td style={{ textAlign: "center" }}>{presence.classe_libelle}</td>
                                        <td style={{ textAlign: "center" }}>{presence.status}</td>
                                        <td>
                                            {/* <button className="btn btn-info" onClick={() => showCardModal(presence.id)}><i className="fa fa-id-card-o"></i></button> */}
                                            <button className="btn btn-danger" onClick={() => showDeleteModal(presence.id)}><i className="fa fa-trash"></i></button>

                                            <button className="btn btn-success" onClick={() => showEditModal(presence.id)}><i className="fa fa-edit"></i></button>
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

export default Presence;