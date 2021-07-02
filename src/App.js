import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost:8080/api/brands";
  const methodUrl="http://localhost:8080/api/brands/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [claseSeleccionada, setClaseSeleccionada]=useState({
    id: '',
    name: '',
    descripcion: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setClaseSeleccionada((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(claseSeleccionada);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPost=async()=>{
    await axios.post(methodUrl, 
      {
        "name": claseSeleccionada.name,
        "descripcion": claseSeleccionada.descripcion
      }
    )
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(`${methodUrl}+${claseSeleccionada.id}`, 
      {
        "name": claseSeleccionada.name,
        "descripcion": claseSeleccionada.descripcion
      }
    )
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(clase=>{
        if(clase.id===claseSeleccionada.id){
          clase.name=claseSeleccionada.name;
          clase.descripcion=claseSeleccionada.descripcion;
        }
      });
      setData(dataNueva,response.data);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(`${methodUrl}+${claseSeleccionada.id}`)
    .then(response=>{
      setData(data.filter(clase=>clase.id!==claseSeleccionada.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarClase=(clase, caso)=>{
    setClaseSeleccionada(clase);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
    <br />
          <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
          <br /><br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(clase=>(
              <tr key={clase.id}>
                <td>{clase.id}</td>
                <td>{clase.name}</td>
                <td>{clase.descripcion}</td>
              <td>
              <button className="btn btn-primary" onClick={()=>seleccionarClase(clase, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarClase(clase, "Eliminar")}>Eliminar</button>
              </td>
              </tr>
            ))}
    
    
          </tbody> 
    
        </table>
    
    
        <Modal isOpen={modalInsertar}>
          <ModalHeader>Insertar Brand</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Nombre: </label>
              <br />
              <input type="text" className="form-control" name="name" onChange={handleChange}/>
              <br />
              <label>descripcion: </label>
              <br />
              <input type="text" className="form-control" name="descripcion" onChange={handleChange}/>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>
    
    
        
        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar Brand</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>name: </label>
              <br />
              <input type="text" className="form-control" name="name" onChange={handleChange} value={claseSeleccionada && claseSeleccionada.name}/>
              <br />
              <label>descripcion: </label>
              <br />
              <input type="text" className="form-control" name="descripcion" onChange={handleChange} value={claseSeleccionada && claseSeleccionada.descripcion}/>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
          </ModalFooter>
        </Modal>
    
        <Modal isOpen={modalEliminar}>
            <ModalBody>
            ¿Estás seguro que deseas eliminar el Brand {claseSeleccionada && claseSeleccionada.name}?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>peticionDelete()}>
                Sí
              </button>
              <button
                className="btn btn-secondary"
                onClick={()=>abrirCerrarModalEliminar()}
              >
                No
              </button>
            </ModalFooter>
          </Modal>
    
        </div>
      );
    }

export default App;
