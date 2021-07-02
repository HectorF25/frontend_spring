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
  const [frameworkSeleccionado, setFrameworkSeleccionado]=useState({
    id: '',
    name: '',
    descripcion: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
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
    var f = new FormData();
    f.append("brandName", frameworkSeleccionado.name);
    f.append("descBrand", frameworkSeleccionado.descripcion);
    f.append("METHOD", "POST");
    await axios.post(methodUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("brandName", frameworkSeleccionado.name);
    f.append("descBrand", frameworkSeleccionado.descripcion);
    f.append("METHOD", "PUT");
    await axios.put(`${methodUrl}${frameworkSeleccionado.id}`, f)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.name=frameworkSeleccionado.name;
          framework.descripcion=frameworkSeleccionado.descripcion;
        }
      });
      setData(dataNueva,response.data);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.delete(`${methodUrl}+${frameworkSeleccionado.id}`, f)
    .then(response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

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
            {data.map(framework=>(
              <tr key={framework.id}>
                <td>{framework.id}</td>
                <td>{framework.name}</td>
                <td>{framework.descripcion}</td>
              <td>
              <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
              </td>
              </tr>
            ))}
    
    
          </tbody> 
    
        </table>
    
    
        <Modal isOpen={modalInsertar}>
          <ModalHeader>Insertar Framework</ModalHeader>
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
          <ModalHeader>Editar Framework</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>name: </label>
              <br />
              <input type="text" className="form-control" name="name" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.name}/>
              <br />
              <label>descripcion: </label>
              <br />
              <input type="text" className="form-control" name="descripcion" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.descripcion}/>
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
            ¿Estás seguro que deseas eliminar el Framework {frameworkSeleccionado && frameworkSeleccionado.name}?
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
